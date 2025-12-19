"""
Home view
"""
from pyramid.view import view_config
from ..response_helpers import success_response


@view_config(route_name='home', renderer='json')
def home_view(request):
    """Home/root endpoint"""
    return success_response(
        message='Welcome to LMS API Platform',
        data={
            'endpoints': {
                'register': '/api/register',
                'login': '/api/login',
                'users': '/api/users',
                'courses': '/api/courses',
                'enrollments': '/api/enrollments',
                'modules': '/api/courses/{id}/modules'
            }
        }
    )