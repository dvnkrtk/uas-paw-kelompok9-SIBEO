"""
Response Helpers for Standardized API Responses - TAHAP 4
"""
import json
from pyramid.response import Response

# --- SUCCESS RESPONSES ---

def success_response(data=None, message="Success", status_code=200, **kwargs):
    """Standard success response"""
    response_data = {
        'status': 'success',
        'message': message,
    }
    
    if data is not None:
        response_data['data'] = data
    
    # Add any additional fields
    response_data.update(kwargs)
    
    return Response(
        json.dumps(response_data, indent=2),
        status=status_code,
        content_type='application/json',
        charset='utf-8'
    )

def created_response(data, message="Resource created successfully"):
    """201 Created response"""
    return success_response(data=data, message=message, status_code=201)

def no_content_response(message="Resource deleted successfully"):
    """204 No Content response"""
    response_data = {
        'status': 'success',
        'message': message
    }
    return Response(
        json.dumps(response_data, indent=2),
        status=204,
        content_type='application/json',
        charset='utf-8'
    )

# --- ERROR RESPONSES ---

def error_response(message, status_code=400, details=None):
    """Standard error response"""
    response_data = {
        'status': 'error',
        'message': message,
    }
    
    if details:
        response_data['details'] = details
    
    return Response(
        json.dumps(response_data, indent=2),
        status=status_code,
        content_type='application/json',
        charset='utf-8'
    )

def bad_request_error(message="Bad request", details=None):
    """400 Bad Request"""
    return error_response(message, 400, details)

def unauthorized_error(message="Authentication required"):
    """401 Unauthorized"""
    return error_response(message, 401)

def forbidden_error(message="Access denied"):
    """403 Forbidden"""
    return error_response(message, 403)

def not_found_error(message="Resource not found"):
    """404 Not Found"""
    return error_response(message, 404)

def conflict_error(message="Resource conflict"):
    """409 Conflict"""
    return error_response(message, 409)

def server_error(message="Internal server error"):
    """500 Internal Server Error"""
    return error_response(message, 500)

# --- VALIDATION HELPERS ---

def validate_required_fields(data, required_fields):
    """Validate required fields in request data"""
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return bad_request_error(
            f"Missing required fields: {', '.join(missing_fields)}"
        )
    return None

def validate_user_role(user, allowed_roles):
    """Validate user role"""
    if user.role not in allowed_roles:
        return forbidden_error(
            f"Access denied. Required roles: {allowed_roles}"
        )
    return None

# --- RESPONSE FORMATTERS ---

def format_course_response(course, include_counts=False):
    """Format course response with optional counts"""
    course_data = course.to_dict()
    
    if include_counts:
        from .models import DBSession, Module, Enrollment
        modules_count = DBSession.query(Module).filter(
            Module.course_id == course.id
        ).count()
        enrollments_count = DBSession.query(Enrollment).filter(
            Enrollment.course_id == course.id
        ).count()
        
        course_data['modules_count'] = modules_count
        course_data['enrollments_count'] = enrollments_count
    
    return course_data

def format_enrollment_response(enrollment, include_course=False):
    """Format enrollment response"""
    enrollment_data = enrollment.to_dict()
    
    if include_course:
        from .models import DBSession, Course
        course = DBSession.query(Course).filter_by(id=enrollment.course_id).first()
        if course:
            enrollment_data['course'] = course.to_dict()
    
    return enrollment_data

def format_module_response(module, include_course=False):
    """Format module response"""
    module_data = module.to_dict()
    
    if include_course:
        from .models import DBSession, Course
        course = DBSession.query(Course).filter_by(id=module.course_id).first()
        if course:
            module_data['course_title'] = course.title
    
    return module_data