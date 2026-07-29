import ffmpeg
import os
import uuid
from typing import Dict, Any, Tuple
from ..config import settings
from .storage import StorageService
import logging

logger = logging.getLogger(__name__)

class VideoProcessor:
    """Handles video transcoding, thumbnail generation, and metadata extraction"""
    
    def __init__(self):
        self.storage = None
        self.output_dir = "/tmp/video_processing"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def _ensure_storage(self):
        if self.storage is None:
            self.storage = StorageService()

    def process_video(self, input_path: str) -> Dict[str, Any]:
        self._ensure_storage()
        """
        Process a video: transcode to H.264, generate thumbnail, extract metadata
        """
        try:
            # Generate unique ID for processed files
            video_id = str(uuid.uuid4())
            
            # Extract metadata
            probe = ffmpeg.probe(input_path)
            metadata = self._extract_metadata(probe)
            
            # Transcode to standard formats (H.264, AAC)
            output_paths = self._transcode_video(input_path, video_id)
            
            # Generate thumbnail
            thumbnail_path = self._generate_thumbnail(input_path, video_id)
            
            # Upload to storage
            uploaded_paths = {}
            for quality, path in output_paths.items():
                uploaded_paths[quality] = self.storage.upload_file(
                    path, 
                    f"videos/{video_id}/{quality}.mp4",
                    content_type="video/mp4"
                )
            
            thumbnail_url = self.storage.upload_file(
                thumbnail_path,
                f"videos/{video_id}/thumbnail.jpg",
                content_type="image/jpeg"
            )
            
            # Clean up temporary files
            self._cleanup(input_path)
            self._cleanup(*output_paths.values())
            self._cleanup(thumbnail_path)
            
            return {
                "video_id": video_id,
                "url": uploaded_paths.get('720p'),  # Default quality
                "thumbnails": {
                    "default": thumbnail_url
                },
                "metadata": metadata,
                "processing_status": "completed"
            }
            
        except Exception as e:
            logger.error(f"Video processing failed: {str(e)}", exc_info=True)
            raise
    
    def _extract_metadata(self, probe: Dict) -> Dict[str, Any]:
        """Extract video metadata from ffprobe output"""
        video_stream = next((s for s in probe['streams'] if s['codec_type'] == 'video'), None)
        audio_stream = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
        
        return {
            "duration": float(probe['format'].get('duration', 0)),
            "bitrate": int(probe['format'].get('bit_rate', 0)),
            "width": int(video_stream.get('width', 0)) if video_stream else 0,
            "height": int(video_stream.get('height', 0)) if video_stream else 0,
            "codec": video_stream.get('codec_name') if video_stream else None,
            "audio_codec": audio_stream.get('codec_name') if audio_stream else None,
            "file_size": int(probe['format'].get('size', 0))
        }
    
    def _transcode_video(self, input_path: str, video_id: str) -> Dict[str, str]:
        """Transcode video to multiple quality levels"""
        output_files = {}
        qualities = [
            {'name': '720p', 'width': 1280, 'height': 720, 'bitrate': '2M'},
            {'name': '480p', 'width': 854, 'height': 480, 'bitrate': '1M'},
            {'name': '360p', 'width': 640, 'height': 360, 'bitrate': '500k'}
        ]
        
        for quality in qualities:
            output_path = f"{self.output_dir}/{video_id}_{quality['name']}.mp4"
            
            try:
                stream = ffmpeg.input(input_path)
                stream = ffmpeg.output(
                    stream,
                    output_path,
                    vcodec='libx264',
                    acodec='aac',
                    video_bitrate=quality['bitrate'],
                    s=f"{quality['width']}x{quality['height']}",
                    **{'movflags': 'faststart'}
                )
                ffmpeg.run(stream, overwrite_output=True, quiet=True)
                output_files[quality['name']] = output_path
            except Exception as e:
                logger.error(f"Failed to transcode to {quality['name']}: {e}")
                # Fallback to original quality
                output_path = f"{self.output_dir}/{video_id}_original.mp4"
                stream = ffmpeg.input(input_path)
                stream = ffmpeg.output(stream, output_path, vcodec='copy', acodec='copy')
                ffmpeg.run(stream, overwrite_output=True, quiet=True)
                output_files['original'] = output_path
                break
        
        return output_files
    
    def _generate_thumbnail(self, input_path: str, video_id: str) -> str:
        """Generate thumbnail from video (at 2-second mark)"""
        output_path = f"{self.output_dir}/{video_id}_thumbnail.jpg"
        
        try:
            stream = ffmpeg.input(input_path, ss=2)
            stream = ffmpeg.output(stream, output_path, vframes=1)
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            return output_path
        except Exception as e:
            logger.error(f"Thumbnail generation failed: {e}")
            # Fallback to first frame
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.output(stream, output_path, vframes=1)
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            return output_path
    
    def _cleanup(self, *paths):
        """Remove temporary files"""
        for path in paths:
            if isinstance(path, dict):
                for p in path.values():
                    if isinstance(p, str) and os.path.exists(p):
                        os.remove(p)
            elif isinstance(path, (list, tuple, set)):
                for p in path:
                    if isinstance(p, str) and os.path.exists(p):
                        os.remove(p)
            elif isinstance(path, str) and os.path.exists(path):
                os.remove(path)
