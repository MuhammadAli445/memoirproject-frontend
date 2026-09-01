import os
import sys
import unittest
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["DATABASE_URL"] = "sqlite:///./test_auth.db"

from app.db.database import Base, engine, SessionLocal
from app.domain.model import User
from app.main import app


class TestAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        if os.path.exists("test_auth.db"):
            try:
                os.remove("test_auth.db")
            except Exception:
                pass

    def test_auth_flow(self):
        # 1. Test Signup
        signup_payload = {
            "email": "test_jwt@example.com",
            "password": "mypassword123",
            "full_name": "Alex Mercer",
        }
        res = self.client.post("/auth/signup", json=signup_payload)
        self.assertEqual(res.status_code, 200)
        user_data = res.json()
        self.assertEqual(user_data["email"], "test_jwt@example.com")
        self.assertEqual(user_data["full_name"], "Alex Mercer")

        # 2. Test Signup Duplicate
        dup_res = self.client.post("/auth/signup", json=signup_payload)
        self.assertEqual(dup_res.status_code, 400)

        # 3. Test Login Success
        login_res = self.client.post(
            "/auth/login",
            json={"email": "test_jwt@example.com", "password": "mypassword123"},
        )
        self.assertEqual(login_res.status_code, 200)
        token_data = login_res.json()
        self.assertIn("access_token", token_data)
        access_token = token_data["access_token"]

        # 4. Test Login Fail
        wrong_res = self.client.post(
            "/auth/login",
            json={"email": "test_jwt@example.com", "password": "wrongpassword"},
        )
        self.assertEqual(wrong_res.status_code, 401)

        # 5. Test Get Me Endpoint
        headers = {"Authorization": f"Bearer {access_token}"}
        me_res = self.client.get("/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["email"], "test_jwt@example.com")
        self.assertEqual(me_res.json()["full_name"], "Alex Mercer")

    def test_health_and_root_endpoints(self):
        # Health endpoint
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "ok")

        # Root endpoint
        res_root = self.client.get("/")
        self.assertEqual(res_root.status_code, 200)


if __name__ == "__main__":
    unittest.main()
