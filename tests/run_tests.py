import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set database URL to sqlite
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

# Force DB recreate
from app.db.database import Base, engine, SessionLocal
from app.db import models
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Import route handlers and schemas
from app.routers.auth import signup, login
from app.routers.user import get_me, update_me, delete_me
from app.schemas.auth import SignupRequest, LoginRequest
from app.schemas.user import UpdateUserRequest
from fastapi import HTTPException

# Color codes
GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"

def run_tests():
    db = SessionLocal()
    print(f"\n{BLUE}=== Starting API Function-Level Integration Tests ==={RESET}\n")
    
    # Track test failures
    failed = False

    # Test 1: Signup New User
    print("Test 1: Signup New User...", end="", flush=True)
    try:
        signup_data = SignupRequest(name="Alice Smith", email="alice@example.com", password="securepassword123")
        res = signup(user_data=signup_data, db=db)
        if res.name == "Alice Smith" and res.email == "alice@example.com":
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Incorrect fields returned)")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 2: Signup Duplicate Email (Should throw HTTP 400)
    print("Test 2: Signup Duplicate Email...", end="", flush=True)
    try:
        dup_data = SignupRequest(name="Alice Clone", email="alice@example.com", password="anotherpassword")
        signup(user_data=dup_data, db=db)
        print(f" {RED}FAILED{RESET} (Expected HTTPException but succeeded)")
        failed = True
    except HTTPException as e:
        if e.status_code == 400 and "already registered" in e.detail:
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Expected 400 Bad Request, got {e.status_code}: {e.detail})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 3: Login Success
    print("Test 3: Login Success...", end="", flush=True)
    try:
        login_data = LoginRequest(email="alice@example.com", password="securepassword123")
        res = login(user_data=login_data, db=db)
        if res.get("message") == "Login successful" and res.get("email") == "alice@example.com":
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Got: {res})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 4: Login Fail (Wrong Password)
    print("Test 4: Login Fail (Wrong Password)...", end="", flush=True)
    try:
        login_data = LoginRequest(email="alice@example.com", password="wrongpassword")
        login(user_data=login_data, db=db)
        print(f" {RED}FAILED{RESET} (Expected HTTPException but succeeded)")
        failed = True
    except HTTPException as e:
        if e.status_code == 401 and "Invalid email or password" in e.detail:
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Expected 401 Unauthorized, got {e.status_code}: {e.detail})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 5: Fetch Profile (ID=1 is default mock)
    print("Test 5: Get User Profile (id=1)...", end="", flush=True)
    try:
        res = get_me(db=db)
        if res.email == "alice@example.com":
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Incorrect profile email)")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 6: Update User Profile (Partial - Name only)
    print("Test 6: Update User Profile Name Only...", end="", flush=True)
    try:
        update_data = UpdateUserRequest(name="Alice Johnson")
        res = update_me(user_data=update_data, db=db)
        if res.name == "Alice Johnson" and res.email == "alice@example.com":
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Update mismatch: {res.name})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 7: Delete User Profile
    print("Test 7: Delete User Profile...", end="", flush=True)
    try:
        res = delete_me(db=db)
        if "successfully" in res.get("message", ""):
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Got: {res})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    # Test 8: Get User Profile after deletion (Should throw 404)
    print("Test 8: Get User Profile after Deletion...", end="", flush=True)
    try:
        get_me(db=db)
        print(f" {RED}FAILED{RESET} (Expected HTTP 404 but succeeded)")
        failed = True
    except HTTPException as e:
        if e.status_code == 404 and "User not found" in e.detail:
            print(f" {GREEN}PASSED{RESET}")
        else:
            print(f" {RED}FAILED{RESET} (Expected 404 Not Found, got {e.status_code}: {e.detail})")
            failed = True
    except Exception as e:
        print(f" {RED}FAILED{RESET} ({e})")
        failed = True

    db.close()
    return not failed

if __name__ == "__main__":
    success = run_tests()
    
    # Cleanup SQLite database
    if os.path.exists("test.db"):
        try:
            os.remove("test.db")
        except Exception:
            pass

    if success:
        print(f"\n{GREEN}All API unit tests passed successfully!{RESET}\n")
        sys.exit(0)
    else:
        print(f"\n{RED}Some API unit tests failed.{RESET}\n")
        sys.exit(1)
