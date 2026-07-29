# GitHub Copilot Agent Instructions for OpenReel Development

## Project Context
OpenReel is an open-source, privacy-first alternative to TikTok.

## Core Principles
1. **Privacy-First**: No behavioral tracking without consent
2. **Transparent**: All code and ranking logic auditable
3. **User-Controlled**: Users can opt-out of personalization
4. **Safe**: Robust moderation with HITL

## Architecture
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Recommendations**: Flink + Hopsworks + PyTorch
- **Video Processing**: FFmpeg
- **Moderation**: HuggingFace + HITL
- **Frontend**: React Native (mobile) + React (web)

## Coding Standards
- Python: PEP 8, type hints, async/await
- JavaScript: ES6, functional components
- Testing: pytest for backend, Jest for frontend

## Key Components to Build
1. ✅ Database models
2. ✅ Auth routes
3. ✅ Video processing service
4. ✅ Recommendation engine (Flink + PyTorch)
5. ✅ Moderation service
6. ✅ Mobile feed screen
7. 🔜 Video upload and camera integration
8. 🔜 HITL moderation dashboard
9. 🔜 Push notifications
10. 🔜 Performance optimization (caching, CDN)

## Common Patterns
- Use async/await for FastAPI routes
- Use httpx for external service calls
- Use alembic for migrations
- Use pytest-asyncio for async tests
- Use react-native-video for video playback
