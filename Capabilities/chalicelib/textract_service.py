import boto3


class TextractService:
    def __init__(self, storage_service):
        self.client = boto3.client('textract', region_name='us-east-1')
        self.bucket_name = storage_service.get_storage_location()

    def detect_text(self, file_name):
        print("file_name", file_name)
        print("self: ", self)
        print("self.bucket_name", self.bucket_name)
        response = self.client.detect_document_text(
            Document = {
                'S3Object': {
                    'Bucket': self.bucket_name,
                    'Name': file_name
                }
            }
        )
        # print("response: ", response['Blocks'])

        lines = []
        for detection in response['Blocks']:
            if detection['BlockType'] == 'LINE' or detection['BlockType'] == 'WORD':
                # print("detection: ", detection)
                lines.append({
                    'text': detection['Text'],
                    'confidence': detection['Confidence'],
                    'boundingBox': detection['Geometry']['BoundingBox']
                })

        print("lines: ", lines)

        return lines


# class TextractService:
#     def _init_(self):
#         self.client = boto3.client('textract')
#         # self.bucket_name = storage_service.get_storage_location()

#     def detect_text(self, image_name):
#         response = self.client.detect_document_text(
#         Document={
#             'S3Object': {
#                 'Bucket': 'businesscardner1234',
#                 'Name': image_name
#             }
#         })

#         str_op = []
#         for item in response['Blocks']:
#             if (item['BlockType'] =='Line' or item['BlockType'] == 'WORD'):
#                 str_op.append(item['Text'])

#         final_string = ' '.join(str_op)
#         print(final_string)

#         return final_string