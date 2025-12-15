"""
Course management views
"""
from pyramid.view import view_config
from ..decorators import login_required, instructor_only, owner_required
from ..response_helpers import (
    success_response, created_response, no_content_response,
    bad_request_error, unauthorized_error, not_found_error, server_error,
    validate_required_fields
)
from ..models import DBSession, User, Course, Module, Enrollment
from .auth_views import get_current_user, get_json_body


def is_enrolled_in_course(student_id, course_id):
    """Cek enrollment status"""
    return DBSession().query(Enrollment).filter_by(
        student_id=student_id, 
        course_id=course_id
    ).first() is not None


@view_config(route_name='get_all_courses', renderer='json')
def get_all_courses(request):
    """Get all courses (public)"""
    dbsession = DBSession()
    courses = dbsession.query(Course).all()
    return success_response(
        data=[c.to_dict() for c in courses],
        count=len(courses)
    )


@view_config(route_name='get_course_detail', renderer='json')
def get_course_detail(request):
    """Get course details by ID"""
    try:
        course_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid course ID')
    
    dbsession = DBSession()
    course = dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return not_found_error('Course not found')
    
    # Tambah informasi tambahan
    course_data = course.to_dict()
    course_data['modules_count'] = dbsession.query(Module).filter_by(course_id=course_id).count()
    course_data['enrollments_count'] = dbsession.query(Enrollment).filter_by(course_id=course_id).count()
    
    return success_response(data=course_data)


@view_config(route_name='create_course', renderer='json')
@login_required
@instructor_only
def create_course(request):
    """Create new course (instructor only)"""
    try:
        data = get_json_body(request)
    except ValueError as e:
        return bad_request_error(str(e))
    
    # Validasi
    validation_error = validate_required_fields(data, ['title', 'description'])
    if validation_error:
        return validation_error
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    # Create course
    dbsession = DBSession()
    new_course = Course(
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        instructor_id=current_user.id
    )
    
    dbsession.add(new_course)
    dbsession.flush()
    
    return created_response(data=new_course.to_dict(), message='Course created successfully')


@view_config(route_name='update_course', renderer='json')
@login_required
@owner_required(Course, id_param='id', owner_field='instructor_id')
def update_course(request):
    """Update course (instructor owner only)"""
    try:
        course_id = int(request.matchdict.get('id'))
        data = request.json_body
    except (ValueError, TypeError):
        return bad_request_error('Invalid course ID or JSON')
    
    dbsession = DBSession()
    course = dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return not_found_error('Course not found')
    
    # Update fields yang ada
    updatable_fields = ['title', 'description', 'category']
    for field in updatable_fields:
        if field in data:
            setattr(course, field, data[field])
    
    dbsession.flush()
    return success_response(data=course.to_dict(), message='Course updated successfully')


@view_config(route_name='delete_course', renderer='json')
@login_required
@owner_required(Course, id_param='id', owner_field='instructor_id')
def delete_course(request):
    """Delete course (instructor owner only)"""
    try:
        course_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid course ID')
    
    dbsession = DBSession()
    course = dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return not_found_error('Course not found')
    
    course_title = course.title
    dbsession.delete(course)
    dbsession.flush()
    
    return no_content_response(f'Course "{course_title}" deleted successfully')