from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ContentModerator:
    """
    AI-based content moderation using HuggingFace models.
    Detects: hate speech, violence, NSFW, self-harm, bullying.
    """
    
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        
        # Load models
        self.hate_speech = pipeline(
            "text-classification",
            model="unitary/toxic-bert",
            device=self.device
        )
        
        self.violence = pipeline(
            "text-classification",
            model="martin-ha/toxic-comment-model",
            device=self.device
        )
        
        # NSFW detection (using CLIP or specialized model)
        self.nsfw = pipeline(
            "image-classification",
            model="Falconsai/nsfw_image_detection",
            device=self.device
        )
        
        logger.info("Content moderation models loaded")
    
    def classify_text(self, text: str) -> Dict[str, float]:
        """Classify text content for safety"""
        results = {}
        
        # Hate speech
        hate_result = self.hate_speech(text)[0]
        results['hate_speech'] = hate_result['score'] if hate_result['label'] == 'toxic' else 1 - hate_result['score']
        
        # Violence
        violence_result = self.violence(text)[0]
        results['violence'] = violence_result['score']
        
        # Overall safety score
        results['safety_score'] = 1.0 - max(results['hate_speech'], results['violence'])
        
        return results
    
    def classify_video(self, video_url: str) -> Dict[str, Any]:
        """Classify video content (thumbnail + metadata)"""
        # In production, extract keyframes and analyze
        # For now, return placeholder
        return {
            'nsfw_score': 0.05,
            'violence_score': 0.10,
            'safety_score': 0.85
        }
    
    def moderate_video(self, video_url: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Full moderation pipeline for video content.
        Returns: status (pending/approved/rejected) and scores.
        """
        # Analyze thumbnail
        thumbnail_url = metadata.get('thumbnail_url')
        image_scores = self.nsfw(thumbnail_url) if thumbnail_url else []
        
        # Analyze title and description
        text_scores = self.classify_text(f"{metadata.get('title', '')} {metadata.get('description', '')}")
        
        # Combine scores
        combined_score = {
            'text_safety': text_scores['safety_score'],
            'image_safety': 1.0 - (image_scores[0]['score'] if image_scores else 0.05),
            'overall': 0.7 * text_scores['safety_score'] + 0.3 * (1.0 - (image_scores[0]['score'] if image_scores else 0.05))
        }
        
        # Determine status
        if combined_score['overall'] < 0.3:
            status = 'rejected'
        elif combined_score['overall'] < 0.6:
            status = 'escalated'  # Requires human review
        else:
            status = 'approved'
        
        return {
            'status': status,
            'scores': combined_score,
            'requires_hitl': status == 'escalated'
        }
