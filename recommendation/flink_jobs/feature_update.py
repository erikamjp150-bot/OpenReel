from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.functions import MapFunction
from pyflink.datastream.connectors.kafka import FlinkKafkaConsumer
from pyflink.common.serialization import SimpleStringSchema
from pyflink.common.typeinfo import Types
import json
import requests
import logging

env = StreamExecutionEnvironment.get_execution_environment()
env.set_parallelism(4)
env.enable_checkpointing(60000)

class FeatureUpdateFunction(MapFunction):
    """Real-time feature update for user interactions"""
    
    def __init__(self):
        self.hopsworks_url = "http://hopsworks:8080/features"
    
    def map(self, value: str) -> str:
        try:
            event = json.loads(value)
            user_id = event.get('user_id')
            
            # Prepare feature update payload
            feature_payload = {
                "user_id": user_id,
                "features": {
                    "last_video_id": event.get('video_id'),
                    "last_action": event.get('action'),
                    "watch_time_sec": event.get('watch_time', 0),
                    "likes_clicked": 1 if event.get('action') == 'like' else 0,
                    "shares_clicked": 1 if event.get('action') == 'share' else 0,
                    "comments_made": 1 if event.get('action') == 'comment' else 0,
                    "timestamp": event.get('timestamp'),
                    "action": event.get('action')
                }
            }
            
            # Update Hopsworks feature store
            # In production: response = requests.post(f"{self.hopsworks_url}/update", json=feature_payload)
            # Simulate response
            return json.dumps({"user_id": user_id, "success": True, "message": "Feature updated"})
            
        except Exception as e:
            logging.error(f"Feature update failed: {e}")
            return json.dumps({"error": str(e)})

# Kafka consumer configuration
kafka_props = {
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'feature-update-group',
    'auto.offset.reset': 'latest'
}

# Source: user interactions from Kafka
source = FlinkKafkaConsumer(
    topics=['user_interactions'],
    deserialization_schema=SimpleStringSchema(),
    properties=kafka_props
)

# Stream processing
stream = env.add_source(source)
updated_stream = stream.map(FeatureUpdateFunction())

# Sink: log results (in production, sink to Kafka or database)
updated_stream.print()

# Execute job
env.execute("OpenReel Real-time Feature Update Pipeline")
