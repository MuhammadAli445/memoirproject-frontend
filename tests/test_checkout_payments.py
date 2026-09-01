import os
import unittest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_memoir_checkout.db"

from app.db.database import Base, engine, SessionLocal
from app.main import app
from app.domain.model import User, MemoirProject, Order
from app.core.jwt import create_access_token


class TestCheckoutPayments(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

        # Create user and project
        db = SessionLocal()
        user = User(
            full_name="Eleanor Vance",
            email="eleanor.vance@example.com",
            password_hash="fakehash",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        cls.user_id = user.id
        cls.token = create_access_token(user.id)

        project = MemoirProject(
            owner_id=user.id,
            subject_name="The Golden Years: A Family Tapestry",
            relationship_to_subject="Grandparents",
            onboarding_step=5,
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        cls.project_id = str(project.id)
        db.close()

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        if os.path.exists("test_memoir_checkout.db"):
            try:
                os.remove("test_memoir_checkout.db")
            except Exception:
                pass

    def setUp(self):
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def test_checkout_summary(self):
        res = self.client.get(
            f"/projects/{self.project_id}/checkout-summary",
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["project_title"], "The Golden Years: A Family Tapestry")
        self.assertEqual(data["relationship_focus"], "Grandparents")
        self.assertEqual(data["estimated_length"], "50-75 Pages")
        self.assertEqual(data["interview_time"], "2-3 hours")
        self.assertEqual(data["subtotal"], 299.0)
        self.assertEqual(data["tax"], 0.0)
        self.assertEqual(data["total_due"], 299.0)
        self.assertEqual(data["currency"], "usd")

    def test_create_payment_intent(self):
        res = self.client.post(
            "/payments/create-intent",
            json={"project_id": self.project_id},
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("client_secret", data)
        self.assertIn("payment_intent_id", data)
        self.assertEqual(data["amount"], 29900)  # $299 in cents
        self.assertEqual(data["currency"], "usd")
        self.assertIn("publishable_key", data)

    def test_record_order(self):
        res = self.client.post(
            "/orders",
            json={
                "project_id": self.project_id,
                "payment_intent_id": "pi_test_12345",
                "billing_details": {"zip": "90210", "name": "Eleanor Vance"},
            },
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 201)
        order = res.json()
        self.assertEqual(order["amount"], 29900)
        self.assertEqual(order["status"], "completed")

        # Verify project is marked as paid
        db = SessionLocal()
        project = db.query(MemoirProject).filter(MemoirProject.id == self.project_id).first()
        self.assertTrue(project.is_paid)
        db.close()

    def test_stripe_webhook_succeeded(self):
        # Create another project for webhook test
        db = SessionLocal()
        project = MemoirProject(
            owner_id=self.user_id,
            subject_name="Webhook Project",
            relationship_to_subject="Parents",
            onboarding_step=5,
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        wh_project_id = str(project.id)
        db.close()

        # Simulate Stripe payment_intent.succeeded webhook payload
        payload = {
            "id": "evt_test_webhook_1",
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_webhook_success_999",
                    "amount": 29900,
                    "currency": "usd",
                    "status": "succeeded",
                    "metadata": {
                        "project_id": wh_project_id,
                        "user_id": str(self.user_id),
                        "user_email": "eleanor.vance@example.com",
                    },
                }
            },
        }

        res = self.client.post(
            "/payments/webhook",
            json=payload,
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "success")

        # Check project is paid and order exists
        db = SessionLocal()
        updated_project = db.query(MemoirProject).filter(MemoirProject.id == wh_project_id).first()
        self.assertTrue(updated_project.is_paid)

        order = db.query(Order).filter(Order.stripe_payment_intent_id == "pi_webhook_success_999").first()
        self.assertIsNotNone(order)
        self.assertEqual(order.status, "completed")
        self.assertEqual(order.amount, 29900)
        db.close()


if __name__ == "__main__":
    unittest.main()
