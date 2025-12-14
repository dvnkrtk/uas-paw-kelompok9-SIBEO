import requests
import json

def test_api():
    base_url = "http://localhost:6543"
    
    print("=== TESTING API ===")
    
    # 1. Test GET home
    print("\n1. Testing GET /")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # 2. Test POST register
    print("\n2. Testing POST /api/register")
    data = {
        "name": "Debug Test User",
        "email": "debug.test@itera.ac.id", 
        "password": "debug123",
        "role": "student"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/register",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # 3. Test GET users
    print("\n3. Testing GET /api/users")
    try:
        response = requests.get(f"{base_url}/api/users")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ERROR: {e}")

if __name__ == "__main__":
    test_api()