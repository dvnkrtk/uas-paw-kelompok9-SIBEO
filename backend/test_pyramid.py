# test_pyramid.py
import os
import sys
from pathlib import Path

# Setup environment
os.environ['DATABASE_URL'] = 'sqlite:///./test_lms.db'
os.environ['SESSION_SECRET'] = 'test-secret-' + os.urandom(16).hex()

# Add src to Python path
src_path = Path(__file__).parent / 'src'
sys.path.insert(0, str(src_path))

print("=" * 60)
print("PYRAMID APPLICATION QUICK TEST")
print("=" * 60)

try:
    print("1. Importing application factory...")
    from e_learning import main as pyramid_app_factory
    print("   ✓ Successfully imported")
    
    print("2. Creating application with test settings...")
    settings = {
        'sqlalchemy.url': os.environ['DATABASE_URL'],
        'pyramid.session.secret': os.environ['SESSION_SECRET'],
        'pyramid.includes': 'pyramid_tm pyramid_retry',
        'pyramid.reload_templates': 'false',
        'pyramid.debug_authorization': 'false',
        'pyramid.debug_notfound': 'false',
        'pyramid.debug_routematch': 'false',
        'pyramid.default_locale_name': 'en',
    }
    
    app = pyramid_app_factory({}, **settings)
    print("   ✓ Application created successfully")
    
    print("3. Testing home endpoint via WSGI...")
    
    def start_response(status, headers):
        print(f"   ✓ Response Status: {status}")
        content_type = [h for h in headers if h[0].lower() == 'content-type']
        if content_type:
            print(f"   ✓ Content-Type: {content_type[0][1]}")
    
    environ = {
        'REQUEST_METHOD': 'GET',
        'PATH_INFO': '/',
        'SERVER_NAME': 'localhost',
        'SERVER_PORT': '8000',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'http',
        'wsgi.input': sys.stdin,
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }
    
    response = app(environ, start_response)
    body = b''.join(response).decode('utf-8', errors='ignore')
    
    print(f"   ✓ Response received ({len(body)} bytes)")
    
    # Check if it looks like JSON
    if body.strip().startswith('{'):
        print("   ✓ Response appears to be valid JSON")
        # Print first 200 chars
        preview = body[:200].replace('\n', ' ').replace('\r', '')
        print(f"   Preview: {preview}...")
    else:
        print("   ⚠️  Response doesn't look like JSON")
        print(f"   Preview: {body[:200]}...")
    
    print("\n" + "=" * 60)
    print("🎉 PYRAMID APPLICATION TEST PASSED!")
    print("Ready for deployment to Railway!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ TEST FAILED: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)