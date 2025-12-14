import psycopg2

def check_specific_user():
    print("🔍 Checking specific user: verified.user@itera.ac.id")
    
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="e_learning_dev", 
            user="postgres",
            password="USSRussian"
        )
        
        cursor = conn.cursor()
        
        # Cek user spesifik
        cursor.execute("SELECT id, name, email, password FROM users WHERE email = 'verified.user@itera.ac.id';")
        user = cursor.fetchone()
        
        if user:
            print(f"✅ USER FOUND:")
            print(f"   ID: {user[0]}")
            print(f"   Name: {user[1]}")
            print(f"   Email: {user[2]}")
            print(f"   Password hash (first 50 chars): {user[3][:50]}")
            
            # Cek hash format
            if user[3].startswith('$argon2'):
                print("   ✅ Argon2 hash detected")
            else:
                print(f"   ⚠️  Hash format: {user[3][:20]}...")
        else:
            print("❌ USER NOT FOUND!")
            
        # Cek semua users untuk debug
        print("\n📋 ALL USERS (for debugging):")
        cursor.execute("SELECT id, email FROM users ORDER BY id;")
        all_users = cursor.fetchall()
        for u in all_users:
            print(f"   ID: {u[0]}, Email: {u[1]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    check_specific_user()