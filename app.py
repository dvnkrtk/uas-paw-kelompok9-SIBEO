from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from sqlalchemy import create_engine
from matakuliah_app.models import DBSession, Base
from matakuliah_app.views import MatakuliahViews

def main():
    # Setup database
    engine = create_engine('sqlite:///matakuliah.db')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    # Setup Pyramid config
    config = Configurator()
    
    # Add routes
    config.add_route('get_all_matakuliah', '/api/matakuliah', request_method='GET')
    config.add_route('create_matakuliah', '/api/matakuliah', request_method='POST')
    config.add_route('get_matakuliah', '/api/matakuliah/{id}', request_method='GET')
    config.add_route('update_matakuliah', '/api/matakuliah/{id}', request_method='PUT')
    config.add_route('delete_matakuliah', '/api/matakuliah/{id}', request_method='DELETE')
    
    # Scan views
    config.scan('matakuliah_app.views')
    
    # Create app
    app = config.make_wsgi_app()
    return app

if __name__ == '__main__':
    app = main()
    server = make_server('0.0.0.0', 6543, app)
    print("✅ Server berjalan di http://localhost:6543")
    print("📚 API tersedia di:")
    print("   GET    http://localhost:6543/api/matakuliah")
    print("   POST   http://localhost:6543/api/matakuliah") 
    print("   GET    http://localhost:6543/api/matakuliah/1")
    print("   PUT    http://localhost:6543/api/matakuliah/1")
    print("   DELETE http://localhost:6543/api/matakuliah/1")
    print("\nTekan Ctrl+C untuk menghentikan server")
    server.serve_forever()