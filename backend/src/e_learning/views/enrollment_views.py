"""
Enrollment management views
"""
from pyramid.view import view_config
from ..decorators import login_required, student_only
from ..response_helpers import (
    success_response, created_response, no_content_response,
    bad_request_error, unauthorized_error, forbidden_error,
    not_found_error, conflict_error, server_error
)
from ..models import DBSession, Course, Enrollment
from .auth_views import get_current_user, get_json_body


@view_config(route_name='create_enrollment', renderer='json')
@login_required
@student_only
def create_enrollment(request):
    """Enroll in course (student only)"""
    try:
        data = get_json_body(request)
        course_id = int(data.get('course_id', 0))
    except (ValueError, TypeError):
        return bad_request_error('Invalid course ID or JSON')
    
    if course_id <= 0:
        return bad_request_error('Valid course_id is required')
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    
    # Cek course exists
    course = dbsession.query(Course).filter_by(id=course_id).first()
    if not course:
        return not_found_error('Course not found')
    
    # Cek sudah terdaftar
    if dbsession.query(Enrollment).filter_by(
        student_id=current_user.id,
        course_id=course_id
    ).first():
        return conflict_error('Already enrolled in this course')
    
    # Create enrollment
    enrollment = Enrollment(student_id=current_user.id, course_id=course_id)
    dbsession.add(enrollment)
    dbsession.flush()
    
    return created_response(data=enrollment.to_dict(), message='Enrolled successfully')


@view_config(route_name='get_my_enrollments', renderer='json')
@login_required
@student_only
def get_my_enrollments(request):
    """Get student's enrollments"""
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    enrollments = dbsession.query(Enrollment).filter_by(student_id=current_user.id).all()
    
    enrollment_data = []
    for enroll in enrollments:
        course = dbsession.query(Course).filter_by(id=enroll.course_id).first()
        if course:
            enrollment_data.append({
                'enrollment_id': enroll.id,
                'enrolled_date': enroll.enrolled_date.isoformat() if enroll.enrolled_date else None,
                'course': course.to_dict()
            })
    
    return success_response(data=enrollment_data, count=len(enrollment_data))


@view_config(route_name='delete_enrollment', renderer='json')
@login_required
@student_only
def delete_enrollment(request):
    """Unenroll from course"""
    try:
        enrollment_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid enrollment ID')
    
    current_user = get_current_user(request)
    if not current_user:
        return unauthorized_error('User not found')
    
    dbsession = DBSession()
    enrollment = dbsession.query(Enrollment).filter_by(id=enrollment_id).first()
    
    if not enrollment:
        return not_found_error('Enrollment not found')
    
    if enrollment.student_id != current_user.id:
        return forbidden_error('Access denied. This is not your enrollment')
    
    # Get course info untuk response message
    course = dbsession.query(Course).filter_by(id=enrollment.course_id).first()
    course_title = course.title if course else f"Course {enrollment.course_id}"
    
    dbsession.delete(enrollment)
    dbsession.flush()
    
    return no_content_response(f'Unenrolled from "{course_title}" successfully')