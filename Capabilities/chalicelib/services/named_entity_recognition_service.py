from collections import defaultdict
import boto3
from botocore.exceptions import BotoCoreError, ClientError
import sys
import re


class NamedEntityRecognitionService:
    def __init__(self):
        self.comprehendmedical = boto3.client('comprehendmedical', region_name='us-east-1')
        self.comprehend = boto3.client('comprehend', region_name='us-east-1')
        
    
    def detect_entities(self, text):
        response_list = defaultdict(list)
        try:
            # Use AWS Comprehend for basic entity detection
            response = self.comprehend.detect_entities(
                Text = text,
                LanguageCode = 'en'
            )
            for record in response['Entities']:
                if record['Type'] == 'NAME':
                    response_list['name'].append(record['Text'])
                if record['Type'] == 'LOCATION':
                    response_list['address'].append(record['Text'])

            # Use AWS ComprehendMedical for specialized entities
            response = self.comprehendmedical.detect_entities_v2(
                Text = text
            )

            for record in response['Entities']:
                if record['Type'] == 'NAME':
                    response_list['name'].append(record['Text'])
                if record['Type'] == 'EMAIL':
                    response_list['email'].append(record['Text'])
                if record['Type'] == 'PHONE_OR_FAX':
                    response_list['phone'].append(record['Text'])
                if record['Type'] == 'URL':
                    response_list['url'].append(record['Text'])
                if record['Type'] == 'ADDRESS':
                    response_list['address'].append(record['Text'])
            
            # Custom detection for URLs and addresses
            self._detect_urls(text, response_list)
            self._detect_addresses(text, response_list)
                    
            return response_list


        except(BotoCoreError, ClientError) as error: 
            print(f"AWS SDK error: {error}")
            return {"error": str(error)}
        
        except Exception as e:
            print(f"Unexpected error: {e}")
            return {"error": str(e)}
    
    def _detect_urls(self, text, response_list):
        """Custom URL detection to catch websites that AWS Comprehend might miss"""
        # Match common URL patterns including those starting with www.
        url_pattern = re.compile(r'\b(?:https?://|www\.)\S+\.[a-zA-Z]{2,}\S*\b')
        urls = url_pattern.findall(text)
        for url in urls:
            if url not in response_list['url']:
                response_list['url'].append(url)
    
    def _detect_addresses(self, text, response_list):
        """Custom address detection logic"""
        lines = text.split('\n')
        
        # Common address patterns
        address_indicators = ['street', 'avenue', 'ave', 'st', 'road', 'rd', 'lane', 'ln', 'drive', 'dr', 
                             'blvd', 'boulevard', 'suite', 'apt', 'apartment', 'floor', 'fl']
        
        # Look for zip code patterns
        zip_pattern = re.compile(r'\b\d{5}(?:-\d{4})?\b')
        
        # State abbreviation pattern
        state_pattern = re.compile(r'\b[A-Z]{2}\b')
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check for address indicators
            if any(indicator in line_lower for indicator in address_indicators) or zip_pattern.search(line):
                # Check if this line might be part of a multi-line address
                potential_address = line
                
                # Look at the next line to see if it might be part of the same address
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if zip_pattern.search(next_line) or state_pattern.search(next_line):
                        potential_address += ', ' + next_line
                
                if potential_address not in response_list['address']:
                    response_list['address'].append(potential_address)
        