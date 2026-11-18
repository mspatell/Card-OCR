from chalice import Blueprint
from datetime import datetime, timezone
import uuid

packages_routes = Blueprint(__name__)


@packages_routes.route('/packages', methods=['POST'], cors=True, content_types=['application/json'])
def post_package():
    body = packages_routes.current_request.json_body
    dynamo = packages_routes.current_app.dynamo_service.dynamodb
    table  = packages_routes.current_app.packages_table_name
    item = {
        'user_id':    {'S': body['user_id']},
        'package_id': {'S': str(uuid.uuid4())},
        'first_name': {'S': body.get('first_name', '')},
        'last_name':  {'S': body.get('last_name', '')},
        'unit_number':{'S': body.get('unit_number', '')},
        'created_at': {'S': datetime.now(timezone.utc).isoformat()},
    }
    dynamo.put_item(TableName=table, Item=item)
    return {'package_id': item['package_id']['S']}


@packages_routes.route('/packages/{user_id}', methods=['GET'], cors=True)
def get_packages(user_id):
    dynamo = packages_routes.current_app.dynamo_service.dynamodb
    table  = packages_routes.current_app.packages_table_name
    resp = dynamo.query(
        TableName=table,
        KeyConditionExpression='user_id = :u',
        ExpressionAttributeValues={':u': {'S': user_id}},
        ScanIndexForward=False,
    )
    items = [
        {
            'package_id': i['package_id']['S'],
            'first_name':  i.get('first_name', {}).get('S', ''),
            'last_name':   i.get('last_name', {}).get('S', ''),
            'unit_number': i.get('unit_number', {}).get('S', ''),
            'created_at':  i.get('created_at', {}).get('S', ''),
        }
        for i in resp.get('Items', [])
    ]
    return {'items': items}
