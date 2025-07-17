import boto3
import logging

class StorageService:
    def __init__(self, storage_location):
        self.client = boto3.client('s3', region_name='us-east-1')
        self.bucket_name = storage_location

    def get_storage_location(self):
        return self.bucket_name

    def upload_file(self, file_bytes, file_name):
        logging.info(f"Uploading file {file_name} to bucket {self.bucket_name}")

        try:
            # Upload the file to the S3 bucket
            self.client.put_object(
                Bucket=self.bucket_name,
                Body=file_bytes,
                Key=file_name,
                ACL='public-read'
            )
            logging.info(f"File uploaded successfully: {file_name}")
        except Exception as e:
            logging.error(f"Error occurred while uploading file: {str(e)}")
            raise

        return {
            'fileId': file_name,
            'fileUrl': f"http://{self.bucket_name}.s3.amazonaws.com/{file_name}"
        }
