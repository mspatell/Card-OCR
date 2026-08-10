from chalice import Chalice, Response
from chalicelib.services import storage_service, recognition_service, textract_service, named_entity_recognition_service
from chalicelib.services.dynamo_service import DynamoService
from chalicelib.routes.images import images_routes
from chalicelib.routes.cards import cards_routes

app = Chalice(app_name='Capabilities')
app.debug = True

# Services
storage_location = 'business-cards-bucket2'
table_name = 'BusinessCardsTable'
app.storage_service = storage_service.StorageService(storage_location)
app.recognition_service = recognition_service.RecognitionService(app.storage_service)
app.textract_service = textract_service.TextractService(app.storage_service)
app.named_entity_recognition_service = named_entity_recognition_service.NamedEntityRecognitionService()
app.dynamo_service = DynamoService(table_name)

# Register blueprints
app.register_blueprint(images_routes)
app.register_blueprint(cards_routes)


@app.route('/test', methods=['POST'], cors=True)
def handler():
    return Response(
        body={'message': 'ok'},
        headers={
            'Access-Control-Allow-Origin': app.current_request.headers.get('origin', '*'),
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': 'true'
        },
        status_code=200
    )
