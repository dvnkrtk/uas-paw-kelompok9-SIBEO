import transaction
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pyramid.paster import get_appsettings
from matakuliah_app.models import Base, User, Course, Module, Enrollment, DBSession

def main():
    # Setup koneksi database
    config_uri = 'development.ini'
    settings = get_appsettings(config_uri)
    engine = create_engine(settings['sqlalchemy.url'])
    DBSession.configure(bind=engine)
    session = DBSession()

    print("🌱 Memulai seeding data...")

    # 1. Create Users (Instructor & Student)
    # Cek apakah user sudah ada untuk menghindari duplikat
    if session.query(User).count() == 0:
        instructor = User(
            name="Muhammad Habib Algifari, S.Kom.,M.TI.",
            email="Habib@itera.ac.id",
            password="password123", # Di real app, ini harus di-hash
            role="instructor"
        )
        
        student = User(
            name="Jonathan Sinaga",
            email="jonathan@student.itera.ac.id",
            password="password123",
            role="student"
        )
        
        session.add(instructor)
        session.add(student)
        session.flush() # Agar kita bisa dapat ID user
        
        print("✅ Users dibuat: Pak Budi & Jonathan")

        # 2. Create Course
        course_web = Course(
            title="Pengembangan Aplikasi Web",
            description="Mempelajari Pyramid Framework dan SQLAlchemy",
            category="Programming",
            instructor_id=instructor.id
        )
        
        session.add(course_web)
        session.flush()
        print("✅ Course dibuat: Pemrograman Web Lanjut")

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
        print("✅ Modules dibuat.")

        # 4. Create Enrollment
        enroll = Enrollment(
            student_id=student.id,
            course_id=course_web.id
        )
        session.add(enroll)
        print("✅ Enrollment dibuat: Jonathan -> Pemrograman Web")

        session.commit()
        print("🎉 Seeding Selesai!")
    else:
        print("⚠️ Data sudah ada, seeding dilewati.")

if __name__ == '__main__':
    main()