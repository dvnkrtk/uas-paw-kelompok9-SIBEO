"""
Dashboard views (stub implementations)
"""
from pyramid.view import view_config
from ..decorators import login_required, instructor_only
from ..response_helpers import (
    success_response, not_found_error, server_error
)
from ..models import DBSession, Course
from .auth_views import get_current_user


@view_config(route_name='instructor_dashboard', renderer='json')
@login_required
@instructor_only
def instructor_dashboard(request):
    """Dashboard untuk instructor"""
    current_user = get_current_user(request)
    if not current_user:
        return not_found_error('User not found')
    
    dbsession = DBSession()
    
    # Get instructor's courses
    courses = dbsession.query(Course).filter_by(instructor_id=current_user.id).all()
    
    # Placeholder implementation
    return success_response(
        message='Instructor dashboard',
        data={
            'instructor': current_user.to_dict(),
            'courses_count': len(courses),
            'courses': [c.to_dict() for c in courses],
            'stats': {
                'total_enrollments': 0,  # Placeholder
                'total_modules': 0       # Placeholder
            }
        }
    )


@view_config(route_name='course_students', renderer='json')
@login_required
@instructor_only
def course_students(request):
    """List students di course (instructor view)"""
    try:
        course_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return server_error('Invalid course ID')
    
    current_user = get_current_user(request)
    if not current_user:
        return not_found_error('User not found')
    
    dbsession = DBSession()
    course = dbsession.query(Course).filter_by(id=course_id).first()
    
    if not course:
        return not_found_error('Course not found')
    
    # Check ownership
    if course.instructor_id != current_user.id:
        return server_error('Access denied. You are not the course instructor')
    
    # Placeholder implementation
    return success_response(
        message=f'Students in course: {course.title}',
        data={
            'course': course.to_dict(),
            'students': [],  # Placeholder
            'student_count': 0
        }
    )


@view_config(route_name='student_progress', renderer='json')
@login_required
def student_progress(request):
    """Progress tracking untuk student"""
    current_user = get_current_user(request)
    if not current_user:
        return not_found_error('User not found')
    
    # Placeholder implementation
    return success_response(
        message='Student progress dashboard',
        data={
            'student': current_user.to_dict(),
            'enrolled_courses': [],  # Placeholder
            'completed_modules': 0,  # Placeholder
            'progress_percentage': 0  # Placeholder
        }
    )