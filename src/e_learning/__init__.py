from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.session import SignedCookieSessionFactory
from .models import DBSession, Base


def main(global_config, **settings):
    """Function returns a Pyramid WSGI application."""
    
    # Database configuration
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    # Session factory
    session_secret = settings.get('pyramid.session.secret', 'fallback_secret_for_dev')
    session_factory = SignedCookieSessionFactory(session_secret)
    
    config = Configurator(
        settings=settings,
        session_factory=session_factory
    )
    
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    
    # --- ROUTES ---
    
    # 1. Homepage
    config.add_route('home', '/', request_method='GET')

    # 2. Authentication
    config.add_route('register', '/api/register', request_method='POST')
    config.add_route('login', '/api/login', request_method='POST')
    config.add_route('logout', '/api/logout', request_method='POST')

    # 3. Users (untuk testing)
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
    
    # Scan views package (PERUBAHAN DI SINI)
    config.scan('e_learning.views')
    
    return config.make_wsgi_app()


def includeme(config):
    """For testing purposes."""
    config.scan('e_learning.views')