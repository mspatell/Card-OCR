import boto3

class RecognitionService:
    def __init__(self, storage_service):
        self.client = boto3.client('rekognition', region_name='us-east-1')
        self.bucket_name = storage_service.get_storage_location()

    def detect_text(self, file_name):
        print("file_name", file_name)
        print("self: ", self)
        print("self.bucket_name", self.bucket_name)
        response = self.client.detect_text(
            Image = {
                'S3Object': {
                    'Bucket': self.bucket_name,
                    'Name': file_name
                }
            }
        )

        lines = []
        for detection in response['TextDetections']:
            if detection['Type'] == 'LINE':
                lines.append({
                    'text': detection['DetectedText'],
                    'confidence': detection['Confidence'],
                    'boundingBox': detection['Geometry']['BoundingBox']
                })

        return lines
