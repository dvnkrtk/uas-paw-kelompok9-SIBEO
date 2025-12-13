from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from sqlalchemy import create_engine
from e_learning.models import DBSession, Base

def main():
    # Setup database
    engine = create_engine('sqlite:///instance/e_learning.db')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    # Setup Pyramid config
    config = Configurator()
    
    # Add ALL routes from views.py
    # Home
    config.add_route('home', '/', request_method='GET')
    
    # Users
    config.add_route('users', '/api/users', request_method='GET')
    config.add_route('create_user', '/api/users', request_method='POST')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')
    
    # Courses (ubah dari 'matakuliah' ke 'courses')
    config.add_route('courses', '/api/courses', request_method='GET')
    config.add_route('create_course', '/api/courses', request_method='POST')
    config.add_route('course_detail', '/api/courses/{id}', request_method='GET')
    
    # Modules
    config.add_route('modules', '/api/courses/{course_id}/modules', request_method='GET')
    config.add_route('create_module', '/api/courses/{course_id}/modules', request_method='POST')
    
    # Enrollment
    config.add_route('enroll', '/api/enroll', request_method='POST')
    
    # Scan views
    config.scan('e_learning.views')
    
    # Create app
    app = config.make_wsgi_app()
    return app

if __name__ == '__main__':
    app = main()
    server = make_server('0.0.0.0', 6543, app)
    print("✅ Server berjalan di http://localhost:6543")
    print("📚 API tersedia di:")
    print("   GET    http://localhost:6543/")
    print("   GET    http://localhost:6543/api/users")
    print("   POST   http://localhost:6543/api/users")
    print("   GET    http://localhost:6543/api/courses")
    print("   POST   http://localhost:6543/api/courses")
    print("   POST   http://localhost:6543/api/enroll")
    print("\nTekan Ctrl+C untuk menghentikan server")
    server.serve_forever()