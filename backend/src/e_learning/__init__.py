import os
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.session import SignedCookieSessionFactory
from zope.sqlalchemy import register
from pyramid.events import NewRequest
from .models import DBSession, Base

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            # Pastikan Origin diambil dari request untuk mendukung credentials
            'Access-Control-Allow-Origin': request.headers.get('Origin', '*'),
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    """Function returns a Pyramid WSGI application."""

    # 1. AMBIL ENV RENDER (DATABASE & SECRET)
    database_url = os.environ.get("DATABASE_URL")
    session_secret = os.environ.get("SESSION_SECRET", "fallback-secret")

    if database_url:
        # Render kadang memberi 'postgres://', ubah jadi 'postgresql://' agar SQLAlchemy kompatibel
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        
        settings['sqlalchemy.url'] = database_url

    settings['pyramid.session.secret'] = session_secret

    # 2. KONFIGURASI ENGINE
    engine = engine_from_config(settings, 'sqlalchemy.')
    
    # Konfigurasi DBSession dengan engine
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    # Register dengan zope.sqlalchemy untuk transaction integration
    register(DBSession)
    
    # --- [MODIFIKASI UTAMA DI SINI] ---
    # Session factory diperbarui untuk mendukung Cross-Origin (Frontend beda domain dengan Backend)
    # dan HTTPS (Render).
    session_factory = SignedCookieSessionFactory(
        session_secret,
        httponly=True,   # Keamanan: Cookie tidak bisa diakses via JavaScript document.cookie
        secure=True,     # WAJIB True untuk Render/HTTPS agar samesite='None' berfungsi
        samesite='None', # WAJIB 'None' agar cookie dikirim saat request PUT/DELETE antar domain
        max_age=86400    # Opsional: Durasi session (contoh: 1 hari dalam detik)
    )
    # ----------------------------------
    
    config = Configurator(
        settings=settings,
        session_factory=session_factory
    )

    # --- CORS SETUP ---
    config.add_subscriber(add_cors_headers_response_callback, NewRequest)
    
    # Route khusus untuk menangani method OPTIONS pada semua endpoint /api/
    config.add_route('cors_options_preflight', '/api/{path:.*}', request_method='OPTIONS')
    config.add_view(lambda request: request.response, route_name='cors_options_preflight')
    
    # INCLUDE pyramid_tm SEBELUM konfigurasi lain
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    
    # --- ROUTES ---
    
    # 1. Homepage
    config.add_route('home', '/', request_method='GET')

    # 2. Authentication
    config.add_route('register', '/api/register', request_method='POST')
    config.add_route('login', '/api/login', request_method='POST')
    config.add_route('logout', '/api/logout', request_method='POST')

    # 3. Users
    config.add_route('users', '/api/users', request_method='GET')
    config.add_route('create_user', '/api/users', request_method='POST')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')

    # 4. Courses
    config.add_route('get_all_courses', '/api/courses', request_method='GET')
    config.add_route('get_course_detail', '/api/courses/{id}', request_method='GET')
    config.add_route('create_course', '/api/courses', request_method='POST')
    config.add_route('update_course', '/api/courses/{id}', request_method='PUT')
    config.add_route('delete_course', '/api/courses/{id}', request_method='DELETE')

    # 5. Enrollments
    config.add_route('create_enrollment', '/api/enrollments', request_method='POST')
    config.add_route('get_my_enrollments', '/api/enrollments/me', request_method='GET')
    config.add_route('delete_enrollment', '/api/enrollments/{id}', request_method='DELETE')

    # 6. Modules
    config.add_route('get_course_modules', '/api/courses/{id}/modules', request_method='GET')
    config.add_route('create_course_module', '/api/courses/{id}/modules', request_method='POST')
    config.add_route('update_module', '/api/modules/{id}', request_method='PUT')
    config.add_route('delete_module', '/api/modules/{id}', request_method='DELETE')

    config.add_route('test_create', '/api/test-create', request_method='POST')

    # Dashboard routes
    config.add_route('instructor_dashboard', '/api/instructor/dashboard', request_method='GET')
    config.add_route('course_students', '/api/courses/{id}/students', request_method='GET')
    config.add_route('student_progress', '/api/student/progress', request_method='GET')
    
    # Scan views package
    config.scan('e_learning.views')
    
    return config.make_wsgi_app()

def includeme(config):
    """For testing purposes."""
    config.scan('e_learning.views')