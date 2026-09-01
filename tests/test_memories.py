import io
import os
import unittest
import time
from PIL import Image
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_memoir_memories.db"
os.environ["STORAGE_DIR"] = "test_memories_uploads"

from app.db.database import Base, engine, SessionLocal
from app.main import app
from app.domain.model import User, MemoirProject, Memory, MediaAsset
from app.core.jwt import create_access_token
from app.services.transcription import run_transcription_job


class TestMemories(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

        # Create user and project
        db = SessionLocal()
        user = User(
            full_name="Memories Tester",
            email="memories_test@example.com",
            password_hash="fakehash",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        cls.user_id = user.id
        cls.token = create_access_token(user.id)

        project = MemoirProject(
            owner_id=user.id,
            subject_name="Grandpa Arthur",
            relationship_to_subject="Grandfather",
            onboarding_step=4,
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        cls.project_id = str(project.id)
        db.close()

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        import shutil
        if os.path.exists("test_memories_uploads"):
            try:
                shutil.rmtree("test_memories_uploads")
            except Exception:
                pass
        if os.path.exists("test_memoir_memories.db"):
            try:
                os.remove("test_memoir_memories.db")
            except Exception:
                pass

    def setUp(self):
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def _create_sample_image(self) -> bytes:
        img = Image.new("RGB", (640, 480), color=(73, 109, 137))
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        return buffer.getvalue()

    def test_memory_crud_flow(self):
        # 1. Create a memory entry
        res = self.client.post(
            "/memories",
            json={
                "project_id": self.project_id,
                "title": "Summer at the Lake",
                "body": "We spent summers fishing and boating.",
                "type": "text",
                "location": "Lake Tahoe",
            },
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 201)
        memory = res.json()
        memory_id = memory["id"]
        self.assertEqual(memory["title"], "Summer at the Lake")

        # 2. Get the memory
        res = self.client.get(f"/memories/{memory_id}", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["location"], "Lake Tahoe")

        # 3. List project memories
        res = self.client.get(f"/projects/{self.project_id}/memories", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.json()) >= 1)

    def test_photo_memory_upload_and_thumbnail(self):
        # 1. Create a memory draft
        res = self.client.post(
            "/memories",
            json={"project_id": self.project_id, "type": "photo", "title": "Old Family Gathering"},
            headers=self.headers,
        )
        memory_id = res.json()["id"]

        # 2. Upload photo to memory (POST /memories/:id/photos) with optional caption
        img_bytes = self._create_sample_image()
        files = {"file": ("family.jpg", img_bytes, "image/jpeg")}
        data = {"caption": "Grandpa with the vintage convertible in 1968"}

        res = self.client.post(
            f"/memories/{memory_id}/photos",
            files=files,
            data=data,
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        photo_res = res.json()
        self.assertEqual(photo_res["memory_id"], memory_id)
        self.assertIn("photo_url", photo_res)
        self.assertIsNotNone(photo_res["thumbnail_url"])
        self.assertEqual(photo_res["caption"], "Grandpa with the vintage convertible in 1968")

        # 3. Verify Memory record updated
        res = self.client.get(f"/memories/{memory_id}", headers=self.headers)
        mem = res.json()
        self.assertEqual(mem["type"], "photo")
        self.assertEqual(mem["photo_caption"], "Grandpa with the vintage convertible in 1968")
        self.assertIsNotNone(mem["thumbnail_url"])

    def test_onboarding_step4_photo_upload_and_cover(self):
        # 1. Upload subject photo (Step 4 of onboarding wizard)
        img_bytes = self._create_sample_image()
        files = {"file": ("subject_portrait.jpg", img_bytes, "image/jpeg")}
        data = {"caption": "Portrait of Arthur", "is_subject": "true", "is_cover": "false"}

        res = self.client.post(
            f"/projects/{self.project_id}/photos",
            files=files,
            data=data,
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        upload_data = res.json()
        self.assertTrue(upload_data["is_subject_photo"])
        self.assertIsNotNone(upload_data["thumbnail_url"])

        # 2. List project photos
        res = self.client.get(f"/projects/{self.project_id}/photos", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.json()) >= 1)

        # 3. Set cover photo
        cover_files = {"file": ("cover.jpg", img_bytes, "image/jpeg")}
        res = self.client.post(
            f"/projects/{self.project_id}/cover-photo",
            files=cover_files,
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        project_data = res.json()
        self.assertIsNotNone(project_data["cover_photo_url"])
        self.assertIsNotNone(project_data["cover_photo_thumbnail_url"])

    def test_audio_memory_upload_and_transcription(self):
        # 1. Create a voice memory
        res = self.client.post(
            "/memories",
            json={"project_id": self.project_id, "type": "voice", "title": "Grandpa's war story"},
            headers=self.headers,
        )
        memory_id = res.json()["id"]

        # 2. Upload audio file (POST /memories/:id/audio)
        audio_content = b"RIFF....WAVEfmt ....data...."  # mock wav binary
        files = {"file": ("recording.wav", audio_content, "audio/wav")}
        data = {"duration_seconds": "42.5"}

        res = self.client.post(
            f"/memories/{memory_id}/audio",
            files=files,
            data=data,
            headers=self.headers,
        )
        self.assertEqual(res.status_code, 200)
        audio_res = res.json()
        self.assertEqual(audio_res["transcription_status"], "pending")
        media_asset_id = audio_res["media_asset_id"]

        # 3. Trigger transcription job directly to simulate completion
        db = SessionLocal()
        media_asset = db.query(MediaAsset).filter(MediaAsset.id == media_asset_id).first()
        file_key = media_asset.file_key
        db.close()

        run_transcription_job(media_asset_id, memory_id, file_key)

        # 4. Poll transcription status (GET /memories/:id/audio/status)
        status_res = self.client.get(
            f"/memories/{memory_id}/audio/status",
            headers=self.headers,
        )
        self.assertEqual(status_res.status_code, 200)
        status_data = status_res.json()
        self.assertEqual(status_data["status"], "completed")
        self.assertIsNotNone(status_data["transcript"])
        self.assertIn("/storage/files/", status_data["audio_url"] or "")
        self.assertIn("token=", status_data["audio_url"] or "")


if __name__ == "__main__":
    unittest.main()
