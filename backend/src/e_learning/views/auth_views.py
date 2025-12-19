"""
Authentication views
"""
from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError
import logging
from ..decorators import login_required
from ..response_helpers import (
    success_response, created_response, 
    bad_request_error, unauthorized_error, conflict_error, server_error,
    validate_required_fields
)
from ..models import DBSession, User

log = logging.getLogger(__name__)

# --- HELPER FUNCTIONS ---
def get_current_user(request):
    """Mendapatkan user dari session"""
    user_id = request.session.get('user_id')
    if not user_id:
        return None
    
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return None
    
    # Gunakan DBSession() - pyramid_tm akan manage scoped session
    return DBSession().query(User).filter_by(id=user_id).first()


def get_json_body(request):
    """Helper untuk mendapatkan JSON body dengan error handling"""
    try:
        return request.json_body
    except ValueError:
        raise ValueError('Invalid JSON format')


@view_config(route_name='register', renderer='json')
def register(request):
    """Register new user"""
    try:
        data = get_json_body(request)
    except ValueError as e:
        return bad_request_error(str(e))
    
    # Validasi required fields
    required_fields = ['name', 'email', 'password', 'role']
    validation_error = validate_required_fields(data, required_fields)
    if validation_error:
        return validation_error
    
    # Normalisasi role ke lowercase untuk konsistensi
    role_input = data['role'].lower().strip()
    
    if role_input not in ['student', 'instructor']:
        return bad_request_error("Role must be 'student' or 'instructor'")
    
    dbsession = DBSession()
    
    # Gunakan transaction manager context
    try:
        # Cek email duplicate
        existing = dbsession.query(User).filter_by(email=data['email']).first()
        if existing:
            return conflict_error('Email already registered')
        
        # Create user
        new_user = User.create_user(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=role_input
        )
        
        dbsession.add(new_user)
        # HANYA flush, JANGAN commit (pyramid_tm akan handle)
        dbsession.flush()
        
        # Bersihkan session lama sebelum set session baru
        request.session.invalidate()
        
        # Set session
        request.session['user_id'] = new_user.id
        request.session['user_email'] = new_user.email
        request.session['user_role'] = new_user.role
        
    except IntegrityError:
        return conflict_error('Email already exists')
    except Exception as e:
        log.error(f"Registration error: {str(e)}")
        return server_error('Registration failed')
    
    return created_response(data=new_user.to_dict(), message='Registration successful')


@view_config(route_name='login', renderer='json')
def login(request):
    """Login user"""
    try:
        data = get_json_body(request)
    except ValueError as e:
        return bad_request_error(str(e))
    
    if 'email' not in data or 'password' not in data:
        return bad_request_error('Email and password required')
    
    dbsession = DBSession()
    
    # PASTIKAN query dengan fresh session
    dbsession.expire_all()  # Clear semua cache
    
    user = dbsession.query(User).filter_by(email=data['email']).first()
    
    if not user or not user.verify_password(data['password']):
        return unauthorized_error('Invalid email or password')
    
    # [FIX UTAMA] Invalidate session lama untuk mencegah conflict/stale data
    request.session.invalidate()
    
    # Set session baru
    request.session['user_id'] = user.id
    request.session['user_email'] = user.email
    # Pastikan role disimpan bersih (antisipasi spasi di DB)
    request.session['user_role'] = user.role.strip().lower() if user.role else ''
    
    return success_response(data=user.to_dict(), message='Login successful')


@view_config(route_name='logout', renderer='json')
def logout(request):
    """Logout user"""
    request.session.invalidate()
    return success_response(message='Logout successful')