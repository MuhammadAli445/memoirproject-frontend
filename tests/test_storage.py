import io
import os
import unittest
from PIL import Image
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_memoir.db"
os.environ["STORAGE_DIR"] = "test_uploads"

from app.db.database import Base, engine, SessionLocal
from app.main import app
from app.services.storage import storage_service
from app.domain.model import User
from app.core.jwt import create_access_token


class TestStorage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

        # Create test user
        db = SessionLocal()
        user = User(
            full_name="Storage Tester",
            email="storage_test@example.com",
            password_hash="fakehash",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        cls.user_id = user.id
        cls.token = create_access_token(user.id)
        db.close()

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        import shutil
        if os.path.exists("test_uploads"):
            try:
                shutil.rmtree("test_uploads")
            except Exception:
                pass
        if os.path.exists("test_memoir.db"):
            try:
                os.remove("test_memoir.db")
            except Exception:
                pass

    def test_signed_upload_url_generation(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        res = self.client.post(
            "/storage/signed-upload-url",
            json={"filename": "family_photo.jpg", "content_type": "image/jpeg", "folder": "test_photos"},
            headers=headers,
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("upload_url", data)
        self.assertIn("file_key", data)
        self.assertIn("download_url", data)
        self.assertEqual(data["method"], "PUT")

    def test_direct_upload_and_thumbnail_generation(self):
        # 1. Get signed upload URL
        headers = {"Authorization": f"Bearer {self.token}"}
        res = self.client.post(
            "/storage/signed-upload-url",
            json={"filename": "sample_img.jpg", "content_type": "image/jpeg", "folder": "test_images"},
            headers=headers,
        )
        data = res.json()
        upload_url = data["upload_url"]

        # 2. Create test image bytes (800x600 red image)
        img = Image.new("RGB", (800, 600), color=(255, 0, 0))
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="JPEG")
        img_bytes = img_buffer.getvalue()

        # 3. Direct upload to upload_url (extract query param token)
        upload_path = upload_url.replace("http://localhost:8000", "")
        upload_res = self.client.put(
            upload_path,
            content=img_bytes,
            headers={"Content-Type": "image/jpeg"},
        )
        self.assertEqual(upload_res.status_code, 200)
        upload_data = upload_res.json()
        self.assertIn("file_url", upload_data)
        self.assertIn("thumbnail_url", upload_data)
        self.assertIsNotNone(upload_data["thumbnail_url"])

    def test_direct_upload_with_invalid_token(self):
        res = self.client.put(
            "/storage/upload?token=invalid.token.here",
            content=b"test data",
            headers={"Content-Type": "text/plain"},
        )
        self.assertEqual(res.status_code, 403)

    def test_signed_read_url(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        # Save a test file
        file_key = "private/secret_doc.txt"
        storage_service.save_bytes(file_key, b"secret content")

        res = self.client.post(
            "/storage/signed-read-url",
            json={"file_key": file_key, "expires_in": 1800},
            headers=headers,
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("read_url", data)
        read_url = data["read_url"]
        self.assertIn("token=", read_url)

        # Serve file with signed token
        serve_path = read_url.replace("http://localhost:8000", "")
        serve_res = self.client.get(serve_path)
        self.assertEqual(serve_res.status_code, 200)
        self.assertEqual(serve_res.content, b"secret content")


if __name__ == "__main__":
    unittest.main()
