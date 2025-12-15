"""
Module management views
"""
from pyramid.view import view_config
from sqlalchemy import func
from ..decorators import login_required, owner_required
from ..response_helpers import (
    success_response, created_response, no_content_response,
    bad_request_error, unauthorized_error, forbidden_error,
    not_found_error, server_error,
    validate_required_fields
)
from ..models import DBSession, Course, Module, Enrollment
from .auth_views import get_current_user, get_json_body
from .course_views import is_enrolled_in_course


@view_config(route_name='get_course_modules', renderer='json')
@login_required
def get_course_modules(request):
    """Get modules for a course (enrolled users or instructor only)"""
    try:
        course_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid course ID')
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    course = dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return not_found_error('Course not found')
    
    # Check access
    user_has_access = False
    if current_user.role == 'instructor' and course.instructor_id == current_user.id:
        user_has_access = True
    elif current_user.role == 'student' and is_enrolled_in_course(current_user.id, course_id):
        user_has_access = True
    
    if not user_has_access:
        return forbidden_error('Access denied. You must be enrolled in this course')
    
    # Get modules
    modules = dbsession.query(Module).filter_by(course_id=course_id).order_by(Module.order).all()
    
    return success_response(
        data=[m.to_dict() for m in modules],
        count=len(modules),
        course_id=course_id,
        course_title=course.title
    )


@view_config(route_name='create_course_module', renderer='json')
@login_required
@owner_required(Course, id_param='id', owner_field='instructor_id')
def create_course_module(request):
    """Create module for course (instructor owner only)"""
    try:
        course_id = int(request.matchdict.get('id'))
        data = get_json_body(request)
    except (ValueError, TypeError) as e:
        return bad_request_error(str(e))
    
    # Validasi
    validation_error = validate_required_fields(data, ['title', 'content'])
    if validation_error:
        return validation_error
    
    dbsession = DBSession()
    
    # Cek course exists
    if not dbsession.query(Course).filter_by(id=course_id).first():
        return not_found_error('Course not found')
    
    # Get next order
    max_order = dbsession.query(func.max(Module.order)).filter_by(course_id=course_id).scalar() or 0
    
    # Create module
    new_module = Module(
        course_id=course_id,
        title=data.get('title'),
        content=data.get('content'),
        order=data.get('order', max_order + 1)
    )
    
    dbsession.add(new_module)
    dbsession.flush()
    
    return created_response(data=new_module.to_dict(), message='Module created successfully')


@view_config(route_name='update_module', renderer='json')
@login_required
def update_module(request):
    """Update module (instructor owner only)"""
    try:
        module_id = int(request.matchdict.get('id'))
        data = request.json_body
    except (ValueError, TypeError):
        return bad_request_error('Invalid module ID or JSON')
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    module = dbsession.query(Module).filter_by(id=module_id).first()
    
    if not module:
        return not_found_error('Module not found')
    
    # Verify ownership via course instructor
    course = dbsession.query(Course).filter_by(id=module.course_id).first()
    if not course or course.instructor_id != current_user.id:
        return forbidden_error('Access denied. You are not the course instructor')
    
    # Update fields
    updatable_fields = ['title', 'content', 'order']
    for field in updatable_fields:
        if field in data:
            if field == 'order':
                try:
                    setattr(module, field, int(data[field]))
                except ValueError:
                    return bad_request_error('Invalid order format')
            else:
                setattr(module, field, data[field])
    
    dbsession.flush()
    return success_response(data=module.to_dict(), message='Module updated successfully')


@view_config(route_name='delete_module', renderer='json')
@login_required
def delete_module(request):
    """Delete module (instructor owner only)"""
    try:
        module_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid module ID')
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    module = dbsession.query(Module).filter_by(id=module_id).first()
    
    if not module:
        return not_found_error('Module not found')
    
    # Verify ownership via course instructor
    course = dbsession.query(Course).filter_by(id=module.course_id).first()
    if not course or course.instructor_id != current_user.id:
        return forbidden_error('Access denied. You are not the course instructor')
    
    module_title = module.title
    dbsession.delete(module)
    dbsession.flush()
    
    return no_content_response(f'Module "{module_title}" deleted successfully')