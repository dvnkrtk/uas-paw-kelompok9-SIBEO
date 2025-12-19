# clear_db.py dengan konfirmasi - FIXED untuk SQLAlchemy 2.0
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

def clear_test_users():
    """Clear test users from database"""
    try:
        # Koneksi ke database
        engine = create_engine('postgresql://postgres:USSRussian@localhost/e_learning_dev')
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Tampilkan data yang akan dihapus - GUNAKAN text()
        print("Users to be deleted (id > 2):")
        users = session.execute(
            text("SELECT id, name, email FROM users WHERE id > 2")
        ).fetchall()
        
        if not users:
            print("No users to delete.")
            return
        
        for user in users:
            print(f"  ID: {user[0]}, Name: {user[1]}, Email: {user[2]}")
        
        # Konfirmasi
        confirm = input(f"\nDelete {len(users)} users? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Cancelled.")
            return
        
        # Eksekusi delete - GUNAKAN text()
        result = session.execute(
            text("DELETE FROM users WHERE id > 2")
        )
        session.commit()
        
        print(f"\nDatabase cleared! {result.rowcount} users deleted.")
        
        session.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clear_test_users()