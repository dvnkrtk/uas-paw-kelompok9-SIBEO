from functools import wraps
from .response_helpers import (
    unauthorized_error, forbidden_error, bad_request_error,
    not_found_error, server_error
)
from .models import DBSession

def login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user_id = request.session.get('user_id')
        if not user_id:
            return unauthorized_error('Authentication required')
        
        try:
            int(user_id)
        except (ValueError, TypeError):
            request.session.invalidate()
            return unauthorized_error('Invalid session, please login again')
        
        return view_func(request, *args, **kwargs)
    return wrapper

def role_required(allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            raw_role = request.session.get('user_role')
            if not raw_role:
                return unauthorized_error('Authentication required')
            
            # [FIX] Normalisasi role dari session untuk menghindari error typo/spasi
            user_role = str(raw_role).strip().lower()
            
            # Pastikan allowed_roles juga dinormalisasi saat pengecekan
            clean_allowed = [r.lower() for r in allowed_roles]
            
            if user_role not in clean_allowed:
                return forbidden_error(f'Access denied. Required roles: {allowed_roles}')
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

def instructor_only(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Gunakan role_required logic manual atau decorator, 
        # tapi di sini kita konsistenkan manual check seperti aslinya tapi lebih aman
        raw_role = request.session.get('user_role')
        user_role = str(raw_role).strip().lower() if raw_role else ''
        
        if user_role != 'instructor':
            return forbidden_error('Instructor access only')
        return view_func(request, *args, **kwargs)
    return wrapper

def student_only(view_func):
    return role_required(['student'])(view_func)

def owner_required(model_class, id_param='id', owner_field='instructor_id'):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            try:
                user_id_str = request.session.get('user_id')
                if not user_id_str:
                    return unauthorized_error('Authentication required')
                user_id = int(user_id_str)
            except (ValueError, TypeError):
                return unauthorized_error('Invalid user session format')
            
            resource_id = request.matchdict.get(id_param)
            if not resource_id:
                return bad_request_error(f'Missing {id_param} parameter')
            
            try:
                resource_id = int(resource_id)
            except ValueError:
                return bad_request_error(f'Invalid {id_param} format')
            
            dbsession = DBSession()
            resource = dbsession.query(model_class).filter_by(id=resource_id).first()
            
            if not resource:
                return not_found_error(f'{model_class.__name__} not found')
            
            owner_id = getattr(resource, owner_field, None)
            
            if owner_id is None:
                return server_error(f'Owner field {owner_field} not found on resource')
            
            if isinstance(owner_id, str):
                try:
                    owner_id = int(owner_id)
                except ValueError:
                    return server_error(f'Invalid owner ID format in database')
            
            if owner_id != user_id:
                return forbidden_error(f'Access denied. You are not the owner of this {model_class.__name__}')
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator