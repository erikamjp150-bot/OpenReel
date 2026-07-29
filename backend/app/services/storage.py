import io
from minio import Minio
from ..config import settings


class StorageService:
    def __init__(self):
        self.client = Minio(
            endpoint=settings.MINIO_ENDPOINT.replace("http://", "").replace("https://", ""),
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        if not self.client.bucket_exists(settings.MINIO_BUCKET):
            self.client.make_bucket(settings.MINIO_BUCKET)

    def upload_file(self, path: str, object_name: str, content_type: str = "application/octet-stream") -> str:
        self.client.fput_object(settings.MINIO_BUCKET, object_name, path, content_type=content_type)
        return f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET}/{object_name}"

    def upload_bytes(self, data: bytes, object_name: str, content_type: str = "application/octet-stream") -> str:
        self.client.put_object(
            settings.MINIO_BUCKET,
            object_name,
            io.BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
        return f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET}/{object_name}"
