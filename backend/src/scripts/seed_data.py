import transaction
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pyramid.paster import get_appsettings
from e_learning.models import Base, User, Course, Module, Enrollment, DBSession

def main():
    # Setup koneksi database - PERBAIKAN PATH
    # Tambahkan path ke parent directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    config_path = os.path.join(project_root, 'src', 'config', 'development.ini')
    
    print(f"📁 Loading config from: {config_path}")
    
    settings = get_appsettings(config_path)
    engine = create_engine(settings['sqlalchemy.url'])
    DBSession.configure(bind=engine)
    session = DBSession()

    print("🌱 Memulai seeding data...")

    # 1. Create Users (Instructor & Student)
    # Cek apakah user sudah ada untuk menghindari duplikat
    if session.query(User).count() == 0:
        # Gunakan create_user method yang sudah hash password
        instructor = User.create_user(
            name="Muhammad Habib Algifari, S.Kom.,M.TI.",
            email="Habib@itera.ac.id",
            password="password123", # Sekarang akan di-hash otomatis
            role="instructor"
        )
        
        student = User.create_user(
            name="Jonathan Sinaga",
            email="jonathan@student.itera.ac.id",
            password="password123",
            role="student"
        )
        
        session.add(instructor)
        session.add(student)
        session.flush() # Agar kita bisa dapat ID user
        
        print("✅ Users dibuat: Pak Habib & Jonathan")
        print(f"   Instructor ID: {instructor.id}")
        print(f"   Student ID: {student.id}")

        # 2. Create Course
        course_web = Course(
            title="Pengembangan Aplikasi Web",
            description="Mempelajari Pyramid Framework dan SQLAlchemy",
            category="Programming",
            instructor_id=instructor.id
        )
        
        session.add(course_web)
        session.flush()
        print(f"✅ Course dibuat: {course_web.title} (ID: {course_web.id})")

        # 3. Create Modules
        mod1 = Module(
            course_id=course_web.id,
            title="Pengenalan MVC",
            content="Materi tentang Model View Controller...",
            order=1
        )
        
        mod2 = Module(
            course_id=course_web.id,
            title="Database dengan SQLAlchemy",
            content="Cara melakukan ORM mapping...",
            order=2
        )
        
        session.add(mod1)
        session.add(mod2)
        print(f"✅ Modules dibuat: {mod1.title}, {mod2.title}")

        # 4. Create Enrollment
        enroll = Enrollment(
            student_id=student.id,
            course_id=course_web.id
        )
        session.add(enroll)
        print(f"✅ Enrollment dibuat: Student {student.name} -> Course {course_web.title}")

        session.commit()
        print("🎉 Seeding Selesai!")
        
        # Tampilkan info login untuk testing
        print("\n🔐 Info Login untuk Testing:")
        print(f"   Instructor: email={instructor.email}, password=password123")
        print(f"   Student: email={student.email}, password=password123")
        
    else:
        user_count = session.query(User).count()
        print(f"⚠️  Data sudah ada ({user_count} users), seeding dilewati.")

if __name__ == '__main__':
    main()