from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPUnauthorized
import json
from sqlalchemy.exc import IntegrityError
from .models import DBSession, User, Course, Module, Enrollment

# --- HOME VIEW ---
@view_config(route_name='home', renderer='json')
def home_view(request):
    return {
        'status': 'success',
        'message': 'Welcome to LMS API Platform',
        'endpoints': {
            'register': '/api/register',
            'login': '/api/login',
            'users': '/api/users',
            'courses': '/api/courses',
            'enrollment': '/api/enroll'
        }
    }

# --- AUTHENTICATION VIEWS - TAMBAHAN TAHAP 2 ---
class AuthViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = DBSession

    @view_config(route_name='register', renderer='json')
    def register(self):
        """Register new user with password hashing"""
        transaction = self.dbsession.begin()  # Start transaction manual
        try:
            # Parse JSON dengan error handling
            try:
                data = self.request.json_body
                print(f"🔧 DEBUG: Register attempt with data: {data}")
            except ValueError as json_error:
                print(f"❌ JSON Parse Error: {json_error}")
                transaction.rollback()
                return Response(
                    json.dumps({'error': 'Invalid JSON format'}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            # Validation
            required_fields = ['name', 'email', 'password', 'role']
            if not all(k in data for k in required_fields):
                print(f"❌ Missing fields: {required_fields}")
                transaction.rollback()
                return Response(
                    json.dumps({'error': 'Missing required fields: name, email, password, role'}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            # Check if email already exists
            existing_user = self.dbsession.query(User).filter(User.email == data['email']).first()
            if existing_user:
                print(f"❌ Email already exists: {data['email']}")
                transaction.rollback()
                return Response(
                    json.dumps({'error': 'Email already registered'}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            # Validate role
            if data['role'] not in ['student', 'instructor']:
                print(f"❌ Invalid role: {data['role']}")
                transaction.rollback()
                return Response(
                    json.dumps({'error': "Role must be 'student' or 'instructor'"}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            print(f"✅ Creating user: {data['name']}, {data['email']}")
            
            # Create user with hashed password
            new_user = User.create_user(
                name=data['name'],
                email=data['email'],
                password=data['password'],
                role=data['role']
            )
            
            self.dbsession.add(new_user)
            self.dbsession.flush()
            
            # ⭐⭐ COMMIT MANUAL ⭐⭐
            transaction.commit()
            
            print(f"✅ User created and COMMITTED with ID: {new_user.id}")
            
            # Start session for new user
            self.request.session['user_id'] = new_user.id
            self.request.session['user_email'] = new_user.email
            self.request.session['user_role'] = new_user.role
            
            print(f"✅ Session set: user_id={new_user.id}")
            
            return {
                'status': 'success',
                'message': 'Registration successful',
                'data': new_user.to_dict(),
                'session': {
                    'user_id': new_user.id,
                    'user_email': new_user.email,
                    'user_role': new_user.role
                }
            }
            
        except Exception as e:
            transaction.rollback()
            import traceback
            error_trace = traceback.format_exc()
            print(f"🔥 CRITICAL ERROR in register: {str(e)}")
            print(f"📋 Full traceback:\n{error_trace}")
            
            return Response(
                json.dumps({'error': f'Registration failed: {str(e)}'}),
                status=500,
                content_type='application/json',
                charset='utf-8'
            )

    @view_config(route_name='login', renderer='json')
    def login(self):
        """Login user and create session"""
        try:
            # Parse JSON dengan error handling
            try:
                data = self.request.json_body
                print(f"🔧 DEBUG: Login attempt for email: {data.get('email', 'NOT PROVIDED')}")
            except ValueError as json_error:
                print(f"❌ JSON Parse Error in login: {json_error}")
                return Response(
                    json.dumps({'error': 'Invalid JSON format'}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            # Validation
            if 'email' not in data or 'password' not in data:
                print(f"❌ Missing email or password in login request")
                return Response(
                    json.dumps({'error': 'Email and password required'}),
                    status=400,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            print(f"🔍 Looking for user with email: {data['email']}")
            
            # Find user by email
            user = self.dbsession.query(User).filter(User.email == data['email']).first()
            
            if not user:
                print(f"❌ User not found: {data['email']}")
                return Response(
                    json.dumps({'error': 'Invalid email or password'}),
                    status=401,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            print(f"✅ User found: {user.name} (ID: {user.id})")
            
            # Verify password
            print(f"🔐 Verifying password...")
            if not user.verify_password(data['password']):
                print(f"❌ Password verification failed for user: {user.email}")
                return Response(
                    json.dumps({'error': 'Invalid email or password'}),
                    status=401,
                    content_type='application/json',
                    charset='utf-8'
                )
            
            print(f"✅ Password verified successfully")
            
            # Create session
            self.request.session['user_id'] = user.id
            self.request.session['user_email'] = user.email
            self.request.session['user_role'] = user.role
            
            print(f"✅ Session created: user_id={user.id}, email={user.email}, role={user.role}")
            
            return {
                'status': 'success',
                'message': 'Login successful',
                'data': user.to_dict(),
                'session': {
                    'user_id': user.id,
                    'user_email': user.email,
                    'user_role': user.role
                }
            }
            
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"🔥 CRITICAL ERROR in login: {str(e)}")
            print(f"📋 Full traceback:\n{error_trace}")
            
            return Response(
                json.dumps({'error': f'Login failed: {str(e)}'}),
                status=500,
                content_type='application/json',
                charset='utf-8'
            )
        
    @view_config(route_name='logout', renderer='json')
    def logout(self):
        """Logout user by clearing session"""
        self.request.session.invalidate()
        return {
            'status': 'success',
            'message': 'Logout successful'
        }

# --- USER VIEWS ---
class UserViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = DBSession

    @view_config(route_name='users', renderer='json')
    def get_all_users(self):
        users = self.dbsession.query(User).all()
        return {'status': 'success', 'data': [u.to_dict() for u in users]}

    @view_config(route_name='create_user', renderer='json')
    def create_user(self):
        """Legacy endpoint - now uses password hashing"""
        try:
            data = self.request.json_body
            if not all(k in data for k in ('name', 'email', 'password', 'role')):
                return Response(json.dumps({'error': 'Missing required fields'}), status=400, content_type='application/json')
            
            # Use the new create_user method with hashing
            new_user = User.create_user(
                name=data['name'],
                email=data['email'],
                password=data['password'],
                role=data['role']
            )
            
            self.dbsession.add(new_user)
            self.dbsession.flush()
            return {'status': 'success', 'data': new_user.to_dict()}
        except IntegrityError:
            self.dbsession.rollback()
            return Response(json.dumps({'error': 'Email already exists'}), status=400, content_type='application/json')

    @view_config(route_name='user_detail', renderer='json')
    def get_user_detail(self):
        user_id = int(self.request.matchdict['id'])
        user = self.dbsession.query(User).filter(User.id == user_id).first()
        if not user:
            return Response(json.dumps({'error': 'User not found'}), status=404, content_type='application/json')
        return {'status': 'success', 'data': user.to_dict()}

# --- COURSE VIEWS ---
class CourseViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = DBSession

    @view_config(route_name='courses', renderer='json')
    def get_all_courses(self):
        courses = self.dbsession.query(Course).all()
        return {'status': 'success', 'data': [c.to_dict() for c in courses]}

    @view_config(route_name='create_course', renderer='json')
    def create_course(self):
        data = self.request.json_body
        new_course = Course(
            title=data.get('title'),
            description=data.get('description'),
            category=data.get('category'),
            instructor_id=data.get('instructor_id')
        )
        self.dbsession.add(new_course)
        self.dbsession.flush()
        return {'status': 'success', 'data': new_course.to_dict()}
    
    @view_config(route_name='course_detail', renderer='json')
    def get_course_detail(self):
        course_id = int(self.request.matchdict['id'])
        course = self.dbsession.query(Course).filter(Course.id == course_id).first()
        if not course:
            return Response(json.dumps({'error': 'Course not found'}), status=404, content_type='application/json')
        return {'status': 'success', 'data': course.to_dict()}

# --- MODULE VIEWS ---
class ModuleViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = DBSession

    @view_config(route_name='modules', renderer='json')
    def get_course_modules(self):
        course_id = int(self.request.matchdict['course_id'])
        modules = self.dbsession.query(Module).filter(Module.course_id == course_id).order_by(Module.order).all()
        return {'status': 'success', 'data': [m.to_dict() for m in modules]}

    @view_config(route_name='create_module', renderer='json')
    def create_module(self):
        course_id = int(self.request.matchdict['course_id'])
        data = self.request.json_body
        
        new_module = Module(
            course_id=course_id,
            title=data.get('title'),
            content=data.get('content'),
            order=data.get('order', 0)
        )
        self.dbsession.add(new_module)
        self.dbsession.flush()
        return {'status': 'success', 'data': new_module.to_dict()}

# --- ENROLLMENT VIEWS ---
class EnrollmentViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = DBSession

    @view_config(route_name='enroll', renderer='json')
    def enroll_student(self):
        data = self.request.json_body
        student_id = data.get('student_id')
        course_id = data.get('course_id')

        # Cek apakah sudah terdaftar
        existing = self.dbsession.query(Enrollment).filter_by(student_id=student_id, course_id=course_id).first()
        if existing:
             return Response(json.dumps({'error': 'Student already enrolled'}), status=400, content_type='application/json')

        enrollment = Enrollment(student_id=student_id, course_id=course_id)
        self.dbsession.add(enrollment)
        self.dbsession.flush()
        return {'status': 'success', 'data': enrollment.to_dict()}
