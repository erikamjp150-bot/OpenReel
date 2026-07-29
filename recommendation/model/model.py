import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Any
import numpy as np
import logging

logger = logging.getLogger(__name__)

class CollaborativeFilteringModel(nn.Module):
    """
    Neural collaborative filtering model for video recommendations.
    Uses user and video embeddings with interaction history.
    """
    
    def __init__(self, num_users: int, num_videos: int, embedding_dim: int = 128):
        super().__init__()
        
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.video_embedding = nn.Embedding(num_videos, embedding_dim)
        
        # Feature layers
        self.fc1 = nn.Linear(embedding_dim * 2, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 64)
        self.fc4 = nn.Linear(64, 1)
        
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, user_ids: torch.Tensor, video_ids: torch.Tensor) -> torch.Tensor:
        user_emb = self.user_embedding(user_ids)
        video_emb = self.video_embedding(video_ids)
        
        # Concatenate embeddings
        combined = torch.cat([user_emb, video_emb], dim=1)
        
        # Dense layers
        x = F.relu(self.fc1(combined))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = torch.sigmoid(self.fc4(x))
        
        return x.squeeze()

class RecommendationService:
    """
    Real-time recommendation service using collaborative filtering.
    Integrates with Hopsworks feature store for real-time features.
    """
    
    def __init__(self, model_path: str = None, feature_store_url: str = None):
        self.model = None
        self.feature_store_url = feature_store_url
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        if model_path and torch.cuda.is_available():
            self.model = torch.load(model_path, map_location=self.device)
        elif model_path:
            self.model = torch.load(model_path, map_location=torch.device('cpu'))
        
        if self.model:
            self.model.eval()
            logger.info(f"Model loaded on {self.device}")
        else:
            logger.warning("No model loaded; using fallback recommendations")
    
    def get_recommendations(self, user_id: int, n: int = 20) -> List[int]:
        """
        Get personalized video recommendations for a user.
        """
        # In production, this would:
        # 1. Get user features from Hopsworks
        # 2. Get candidate videos from video database
        # 3. Rank candidates using the model
        # 4. Return top-N video IDs
        
        if not self.model:
            # Fallback: return most popular videos
            return self._popular_videos(n)
        
        # Simplified: return random recommendations for demo
        # In production, use model inference
        return self._popular_videos(n)
    
    def _popular_videos(self, n: int) -> List[int]:
        """Fallback: return most popular videos"""
        # In production, query database for most viewed videos
        # Placeholder: return top video IDs
        return list(range(1, n+1))
    
    def update_user_features(self, user_id: int, interaction: Dict[str, Any]):
        """
        Update user features in real-time via Hopsworks.
        """
        if not self.feature_store_url:
            logger.warning("Feature store URL not configured")
            return
        
        try:
            import requests
            response = requests.post(
                f"{self.feature_store_url}/features/update",
                json={
                    "user_id": user_id,
                    "features": interaction
                }
            )
            response.raise_for_status()
            logger.info(f"Features updated for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to update features: {e}")
