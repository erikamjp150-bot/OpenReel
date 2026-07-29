# OpenReel

**An open-source, privacy-first alternative to TikTok**

## Mission

To build a short-form video platform that entertains without exploiting. OpenReel is designed to deliver engaging content without the addictive design patterns that characterize mainstream platforms.

## Key Features

- **Real-Time Recommendations**: Transparent, user-controlled recommendation algorithm
- **Privacy-First**: No behavioral tracking without explicit consent
- **Content Moderation**: AI + HITL for safety
- **Video Processing**: Open-source transcoding pipeline
- **Open Architecture**: Fully auditable code and ranking logic

## Tech Stack

- **Backend**: FastAPI (Python), PostgreSQL
- **Recommendations**: Apache Flink, Hopsworks, PyTorch
- **Video Processing**: FFmpeg, OpenCV
- **Frontend**: React Native (mobile) + React (web)
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis
- **Queue**: Kafka

## Quick Start

```bash
# Clone and set up
git clone https://github.com/erikamjp150-bot/OpenReel.git
cd OpenReel
cp .env.example .env

# Start infrastructure
docker-compose up -d

# Run backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Run Flink job
cd ../recommendation
python -m flink_jobs.feature_update

# Run frontend (React Native)
cd ../frontend/mobile
npm install
npm start
