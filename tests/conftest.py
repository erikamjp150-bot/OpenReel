import os
import sys
from pathlib import Path

# Ensure repo root is on sys.path for package imports during tests.
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

from backend.app.database import engine
from backend.app.models import Base

Base.metadata.create_all(bind=engine)
