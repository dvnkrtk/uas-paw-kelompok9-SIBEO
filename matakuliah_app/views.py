from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
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
            'users': '/api/users',
            'courses': '/api/courses',
            'enrollment': '/api/enroll'
        }
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
        try:
            data = self.request.json_body
            if not all(k in data for k in ('name', 'email', 'password', 'role')):
                return Response(json.dumps({'error': 'Missing required fields'}), status=400, content_type='application/json')
            
            new_user = User(
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