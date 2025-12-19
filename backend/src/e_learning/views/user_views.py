"""
User management views
"""
from pyramid.view import view_config
from ..response_helpers import (
    success_response, bad_request_error, not_found_error, server_error
)
from ..models import DBSession, User


@view_config(route_name='users', renderer='json')
def get_all_users(request):
    """Get all users (for testing)"""
    dbsession = DBSession()
    
    # PASTIKAN fresh query
    dbsession.expire_all()
    
    users = dbsession.query(User).all()
    return success_response(
        data=[u.to_dict() for u in users],
        count=len(users)
    )


@view_config(route_name='user_detail', renderer='json')
def get_user_detail(request):
    """Get user by ID"""
    try:
        user_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        return bad_request_error('Invalid user ID')
    
    dbsession = DBSession()
    user = dbsession.query(User).filter_by(id=user_id).first()
    
    if not user:
        return not_found_error('User not found')
    
    return success_response(data=user.to_dict())