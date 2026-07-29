import pytest
from fastapi.testclient import TestClient
from backend.app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "openreel-backend"}


def test_feed_route_empty(client):
    response = client.get("/feed")
    assert response.status_code == 200
    data = response.json()
    assert data["results"] == []
    assert data["page"] == 1
    assert data["page_size"] == 20
