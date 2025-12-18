#!/usr/bin/env python
"""
Railway Deployment - Simple version using existing production.ini
"""
import os
import sys
from pathlib import Path

# Add src to Python path
src_path = Path(__file__).parent / 'src'
sys.path.insert(0, str(src_path))

def main():
    print("=" * 60)
    print("Starting Pyramid E-Learning Application on Railway")
    print("=" * 60)
    
    try:
        # Update environment variables untuk PasteDeploy
        # PasteDeploy bisa baca ${VAR} dari environment
        
        # Set default jika tidak ada
        if 'DATABASE_URL' not in os.environ:
            print("⚠️  WARNING: DATABASE_URL not set, using default")
            os.environ['DATABASE_URL'] = 'postgresql://localhost/e_learning'
        
        if 'SESSION_SECRET' not in os.environ:
            print("⚠️  WARNING: SESSION_SECRET not set, using default")
            os.environ['SESSION_SECRET'] = 'railway-default-secret-change-me'
        
        if 'PORT' not in os.environ:
            os.environ['PORT'] = '8000'
        
        # Load production.ini
        config_file = str(Path(__file__).parent / 'src/config/production.ini')
        
        if not Path(config_file).exists():
            print(f"✗ Config file not found: {config_file}")
            sys.exit(1)
        
        print(f"✓ Using config file: {config_file}")
        print(f"✓ Database URL: {os.environ.get('DATABASE_URL', '')[:50]}...")
        print(f"✓ Port: {os.environ.get('PORT')}")
        
        # Import dan setup
        from pyramid.paster import get_app, setup_logging
        
        # Setup logging
        setup_logging(config_file)
        
        # Get WSGI application
        app = get_app(config_file, 'main')
        
        # Run with Waitress
        from waitress import serve
        port = int(os.environ.get('PORT', 8000))
        host = '0.0.0.0'
        
        print(f"✓ Starting server on {host}:{port}")
        print("=" * 60)
        
        serve(app, host=host, port=port)
        
    except Exception as e:
        print(f"✗ Error starting application: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()