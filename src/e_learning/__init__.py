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
    
    # --- ROUTES ---
    
    # 1. Route untuk Homepage
    config.add_route('home', '/', request_method='GET')

    # 2. Routes untuk Authentication - TAMBAHAN TAHAP 2
    config.add_route('register', '/api/register', request_method='POST')
    config.add_route('login', '/api/login', request_method='POST')
    config.add_route('logout', '/api/logout', request_method='POST')  # Optional

    # 3. Routes untuk Users
    config.add_route('users', '/api/users', request_method='GET')
    config.add_route('create_user', '/api/users', request_method='POST')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')

    # 4. Routes untuk Courses
    config.add_route('courses', '/api/courses', request_method='GET')
    config.add_route('create_course', '/api/courses', request_method='POST')
    config.add_route('course_detail', '/api/courses/{id}', request_method='GET')

    # 5. Routes untuk Modules
    config.add_route('modules', '/api/courses/{course_id}/modules', request_method='GET')
    config.add_route('create_module', '/api/courses/{course_id}/modules', request_method='POST')

    # 6. Routes untuk Enrollments
    config.add_route('enroll', '/api/enroll', request_method='POST')
    
    # Scan views
    config.scan('.views')
    
    return config.make_wsgi_app()


def includeme(config):
    """For testing purposes."""
    config.scan('.views')