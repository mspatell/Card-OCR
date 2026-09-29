from chalice import Blueprint
from chalicelib.models.business_card import BusinessCard
import json

cards_routes = Blueprint(__name__)


@cards_routes.route('/cards/{user_id}', methods=['GET'], cors=True)
def get_cards(user_id):
    """Get the paginated list of cards for a user"""
    try:
        dynamo = cards_routes.current_app.dynamo_service
        params = cards_routes.current_request.query_params or {}

        last_key_param = params.get('last_key')
        exclusive_start_key = json.loads(last_key_param) if last_key_param else None

        result = dynamo.search_cards(user_id, exclusive_start_key=exclusive_start_key)

        if 'Items' not in result:
            return {'items': [], 'last_key': None}

        cards_list = []
        for index, item in enumerate(result['Items'], start=1):
            try:
                phone = ''
                if 'telephone_numbers' in item:
                    phone = (item['telephone_numbers'].get('SS') or item['telephone_numbers'].get('NS') or [''])[0]

                email = ''
                if 'email_addresses' in item:
                    email = item['email_addresses'].get('SS', [''])[0]

                name = (
                    item.get('card_names', {}).get('S') or
                    item.get('company_name', {}).get('S', '')
                )

                cards_list.append({
                    'id': index,
                    'card_id': item.get('card_id', {}).get('S', ''),
                    'name': name,
                    'phone': phone,
                    'email': email,
                    'website': item.get('company_website', {}).get('S', ''),
                    'address': item.get('company_address', {}).get('S', ''),
                    'image_storage': item.get('image_storage', {}).get('S', '')
                })
            except Exception as e:
                print(f"Error processing item: {e}, item: {item}")
                continue

        next_key = result.get('LastEvaluatedKey')
        return {
            'items': cards_list,
            'last_key': json.dumps(next_key) if next_key else None
        }
    except Exception as e:
        return {"error": str(e)}


@cards_routes.route('/cards', methods=['POST'], cors=True, content_types=['application/json'])
def post_card():
    """Creates a card"""
    req_body = cards_routes.current_request.json_body
    card = BusinessCard(
        req_body['user_id'], req_body['card_id'], req_body['user_names'],
        req_body['telephone_numbers'], req_body['email_addresses'],
        req_body['company_name'], req_body['company_website'],
        req_body['company_address'], req_body['image_storage']
    )
    cards_routes.current_app.dynamo_service.store_card(card)
    return {"card_id": card.card_id}


@cards_routes.route('/cards', methods=['PUT'], cors=True, content_types=['application/json'])
def put_card():
    """Updates a card"""
    req_body = cards_routes.current_request.json_body
    card = BusinessCard(
        req_body['user_id'], req_body['card_id'], req_body['name'],
        [req_body['phone']], [req_body['email']], req_body['name'],
        req_body['website'], req_body['address'], req_body['image_storage']
    )
    cards_routes.current_app.dynamo_service.update_card(card)


@cards_routes.route('/cards/{user_id}/{card_id}', methods=['DELETE'], cors=True)
def delete_card(user_id, card_id):
    """Deletes a card"""
    cards_routes.current_app.dynamo_service.delete_card(user_id, card_id)


@cards_routes.route('/card/{user_id}/{card_id}', methods=['GET'], cors=True)
def get_card(user_id, card_id):
    """Query a specific card by id"""
    return cards_routes.current_app.dynamo_service.get_card(user_id, card_id)
