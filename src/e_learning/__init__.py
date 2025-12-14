from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.session import SignedCookieSessionFactory  # TAMBAHAN
from .models import (
    DBSession,
    Base,
)


def main(global_config, **settings):
    """Function returns a Pyramid WSGI application."""
    
    # Database configuration
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    # Session factory - TAMBAHAN untuk fix session
    session_secret = settings.get('pyramid.session.secret', 'fallback_secret_for_dev')
    session_factory = SignedCookieSessionFactory(session_secret)
    
    config = Configurator(
        settings=settings,
        session_factory=session_factory  # TAMBAHAN
    )
    
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    
    # --- ROUTES - UPDATE UNTUK TAHAP 3 ---
    
    # 1. Homepage
    config.add_route('home', '/', request_method='GET')

    # 2. Authentication - TETAP SAMA
    config.add_route('register', '/api/register', request_method='POST')
    config.add_route('login', '/api/login', request_method='POST')
    config.add_route('logout', '/api/logout', request_method='POST')

    # 3. Users - TETAP SAMA (untuk testing)
    config.add_route('users', '/api/users', request_method='GET')
    config.add_route('create_user', '/api/users', request_method='POST')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')

    # 4. Courses - SESUAI SPESIFIKASI TAHAP 3
    config.add_route('get_all_courses', '/api/courses', request_method='GET')  # Public
    config.add_route('get_course_detail', '/api/courses/{id}', request_method='GET')  # Public
    config.add_route('create_course', '/api/courses', request_method='POST')  # Instructor only
    config.add_route('update_course', '/api/courses/{id}', request_method='PUT')  # Instructor owner only
    config.add_route('delete_course', '/api/courses/{id}', request_method='DELETE')  # Instructor owner only

    # 5. Enrollments - SESUAI SPESIFIKASI TAHAP 3
    config.add_route('create_enrollment', '/api/enrollments', request_method='POST')  # Student only
    config.add_route('get_my_enrollments', '/api/enrollments/me', request_method='GET')  # Student only
    config.add_route('delete_enrollment', '/api/enrollments/{id}', request_method='DELETE')  # Student owner only

    # 6. Modules - SESUAI SPESIFIKASI TAHAP 3
    config.add_route('get_course_modules', '/api/courses/{id}/modules', request_method='GET')  # Enrolled users only
    config.add_route('create_course_module', '/api/courses/{id}/modules', request_method='POST')  # Instructor owner only
    config.add_route('update_module', '/api/modules/{id}', request_method='PUT')  # Instructor owner only
    config.add_route('delete_module', '/api/modules/{id}', request_method='DELETE')  # Instructor owner only

    config.add_route('test_create', '/api/test-create', request_method='POST')
    

    # OLD ROUTES (akan dihapus nanti)
    # config.add_route('courses', '/api/courses', request_method='GET')  # DUPLIKAT dengan get_all_courses
    # config.add_route('course_detail', '/api/courses/{id}', request_method='GET')  # DUPLIKAT dengan get_course_detail
    # config.add_route('modules', '/api/courses/{course_id}/modules', request_method='GET')  # GANTI ke get_course_modules
    # config.add_route('create_module', '/api/courses/{course_id}/modules', request_method='POST')  # GANTI ke create_course_module
    # config.add_route('enroll', '/api/enroll', request_method='POST')  # GANTI ke create_enrollment
    
    # Scan views
    config.scan('.views')
    
    return config.make_wsgi_app()


def includeme(config):
    """For testing purposes."""
    config.scan('.views')