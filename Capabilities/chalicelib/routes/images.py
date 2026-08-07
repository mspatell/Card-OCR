from chalice import Blueprint
import base64
import json

images_routes = Blueprint(__name__)


@images_routes.route('/images', methods=['POST'], cors=True)
def upload_image():
    """processes file upload and saves file to storage service"""
    request_data = json.loads(images_routes.current_request.raw_body)
    file_name = request_data['filename']
    file_bytes = base64.b64decode(request_data['filebytes'])
    return images_routes.current_app.storage_service.upload_file(file_bytes, file_name)


@images_routes.route('/images/{image_id}/recognize_entities', methods=['POST'], cors=True)
def recognize_image_entities(image_id):
    """detects then extracts named entities from text in the specified image"""
    try:
        MIN_CONFIDENCE = 80.0
        text_lines = images_routes.current_app.textract_service.detect_text(image_id)

        recognized_lines = [
            line['text'] for line in text_lines
            if float(line['confidence']) >= MIN_CONFIDENCE
        ]
        ner_text = " ".join(recognized_lines)
        return images_routes.current_app.named_entity_recognition_service.detect_entities(ner_text)
    except Exception as e:
        return {"error": str(e)}
