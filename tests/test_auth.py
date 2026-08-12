import os
import sys
import unittest
from fastapi import HTTPException

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["DATABASE_URL"] = "sqlite:///./test_auth.db"

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.api.routes.auth import signup, login, refresh, me
from app.schemas.auth import SignupRequest, LoginRequest, RefreshRequest


class TestAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        if os.path.exists("test_auth.db"):
            try:
                os.remove("test_auth.db")
            except Exception:
                pass

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_auth_flow(self):
        # 1. Test Signup with name
        signup_data = SignupRequest(email="test_jwt@example.com", password="mypassword123", name="Alex Mercer")
        token_res = signup(body=signup_data)
        self.assertIsNotNone(token_res.access_token)
        self.assertIsNotNone(token_res.refresh_token)

        # 2. Test Signup Duplicate
        with self.assertRaises(HTTPException) as context:
            signup(body=signup_data)
        self.assertEqual(context.exception.status_code, 409)

        # 3. Test Login Success
        login_data = LoginRequest(email="test_jwt@example.com", password="mypassword123")
        login_res = login(body=login_data)
        self.assertIsNotNone(login_res.access_token)

        # 4. Test Login Fail
        wrong_login_data = LoginRequest(email="test_jwt@example.com", password="wrongpassword")
        with self.assertRaises(HTTPException) as context:
            login(body=wrong_login_data)
        self.assertEqual(context.exception.status_code, 401)

        # 5. Test Refresh Token
        refresh_data = RefreshRequest(refresh_token=login_res.refresh_token)
        refresh_res = refresh(body=refresh_data)
        self.assertIsNotNone(refresh_res.access_token)

        # 6. Test Get Me Endpoint
        user = self.db.query(User).filter(User.email == "test_jwt@example.com").first()
        self.assertIsNotNone(user)
        me_res = me(current_user=user)
        self.assertEqual(me_res.email, "test_jwt@example.com")
        self.assertEqual(me_res.name, "Alex Mercer")
        self.assertFalse(me_res.is_oauth_user)


    def test_health_and_root_endpoints(self):
        from fastapi.testclient import TestClient
        from app.main import app

        client = TestClient(app)

        # Health endpoint
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "ok")

        # Root endpoint (returns index.html or json status)
        res_root = client.get("/")
        self.assertEqual(res_root.status_code, 200)

    def test_google_state_verification(self):
        from app.core.google_oauth import generate_state, verify_state
        state = generate_state()
        self.assertTrue(verify_state(state))
        self.assertFalse(verify_state("invalid_state_token"))


if __name__ == "__main__":
    unittest.main()

