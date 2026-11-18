import boto3

_ssm = boto3.client('ssm', region_name='us-east-1')

def _get(name):
    return _ssm.get_parameter(Name=name)['Parameter']['Value']

storage_location    = _get('/card-ocr/storage_location')
table_name          = _get('/card-ocr/table_name')
packages_table_name = _get('/card-ocr/packages_table_name')
