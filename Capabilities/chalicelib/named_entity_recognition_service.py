from collections import defaultdict
import boto3
from botocore.exceptions import BotoCoreError, ClientError
import sys


class NamedEntityRecognitionService:
    def __init__(self):
        self.comprehendmedical = boto3.client('comprehendmedical')
        self.comprehend = boto3.client('comprehend')
        
    
    def detect_entities(self, text):
        response_list = defaultdict(list)
        try:
            response = self.comprehend.detect_entities(
            Text = text,
            LanguageCode = 'en'
        )
            for record in response['Entities']:
                if record['Type'] == 'PERSON':
                    response_list['name'].append(record['Text'])


            response = self.comprehendmedical.detect_entities(
                Text = text
            )

            for record in response['Entities']:
                if record['Type'] == 'EMAIL':
                    response_list['email'].append(record['Text'])
                if record['Type'] == 'PHONE_OR_FAX':
                    response_list['phone'].append(record['Text'])
                if record['Type'] == 'URL':
                    response_list['url'].append(record['Text'])
                if record['Type'] == 'ADDRESS':
                    response_list['address'].append(record['Text'])
                    
            return response_list


        except(BotoCoreError, ClientError) as error: 
            print(error)
            sys.exit(-1)
        