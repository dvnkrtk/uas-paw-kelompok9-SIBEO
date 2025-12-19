# src/e_learning/response_helpers.py
from pyramid.response import Response
import json

def json_response(status_code, body):
    return Response(
        status_code=status_code,
        content_type='application/json',
        json_body=body
    )

def success_response(data=None, message=None, count=None, **extra):
    response_body = {'success': True}
    if message:
        response_body['message'] = message
    if data is not None:
        response_body['data'] = data
    if count is not None:
        response_body['count'] = count
    if extra:
        response_body.update(extra)
    return json_response(200, response_body)

def created_response(data=None, message=None):
    response_body = {'success': True}
    if message:
        response_body['message'] = message
    if data:
        response_body['data'] = data
    return json_response(201, response_body)

def no_content_response(message=None):
    response_body = {'success': True}
    if message:
        response_body['message'] = message
    return json_response(204, response_body)

# Error responses
def error_response(status_code, message, details=None):
    response_body = {
        'success': False,
        'error': {
            'code': status_code,
            'message': message
        }
    }
    if details:
        response_body['error']['details'] = details
    return json_response(status_code, response_body)

def bad_request_error(message='Bad Request', details=None):
    return error_response(400, message, details)

def unauthorized_error(message='Unauthorized', details=None):
    return error_response(401, message, details)

def forbidden_error(message='Forbidden', details=None):
    return error_response(403, message, details)

def not_found_error(message='Not Found', details=None):
    return error_response(404, message, details)

def conflict_error(message='Conflict', details=None):
    return error_response(409, message, details)

def server_error(message='Internal Server Error', details=None):
    return error_response(500, message, details)

def validate_required_fields(data, required_fields):
    missing_fields = []
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == '':
            missing_fields.append(field)
    
    if missing_fields:
        return bad_request_error(
            f'Missing required fields: {", ".join(missing_fields)}'
        )
    return None