from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    ForeignKey,
    DateTime,
    func
)
from passlib.context import CryptContext

DBSession = scoped_session(sessionmaker())
Base = declarative_base()

# Password hashing context - GUNAKAN Argon2
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

# 1. Tabel Users (Student & Instructor)
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False) # In production, hash this!
    role = Column(String(20), nullable=False) # 'student' or 'instructor'
    
    # Relationship: User (Instructor) -> Courses
    courses_taught = relationship("Course", back_populates="instructor")
    # Relationship: User (Student) -> Enrollments
    enrollments = relationship("Enrollment", back_populates="student")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }
    
    # TAMBAHAN TAHAP 2: Password hashing methods - PERBAIKI INDENTASI
    def set_password(self, password):
        """Hash password dan simpan"""
        self.password = pwd_context.hash(password)
    
    def verify_password(self, password):
        """Verifikasi password dengan hash"""
        return pwd_context.verify(password, self.password)
    
    @classmethod
    def create_user(cls, name, email, password, role):
        """Helper method untuk membuat user dengan password hashing"""
        user = cls(name=name, email=email, role=role)
        user.set_password(password)
        return user

# 2. Tabel Courses
class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)
    instructor_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    instructor = relationship("User", back_populates="courses_taught")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor.name if self.instructor else None
        }

# 3. Tabel Modules (Content Management)
class Module(Base):
    __tablename__ = 'modules'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=True) # Could be HTML, text, or link
    order = Column(Integer, default=0)
    
    # Relationship
    course = relationship("Course", back_populates="modules")

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'title': self.title,
            'content': self.content,
            'order': self.order
        }

# 4. Tabel Enrollments (Hubungan Student - Course)
class Enrollment(Base):
    __tablename__ = 'enrollments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    enrolled_date = Column(DateTime, default=func.now())
    
    # Relationships
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'enrolled_date': self.enrolled_date.isoformat() if self.enrolled_date else None
        }