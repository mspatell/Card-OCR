import boto3
import boto3.dynamodb
import uuid

from chalicelib.business_card import BusinessCard
from chalicelib.business_card_list import BusinessCardList


class DynamoService:
    """Service to manage interaction with AWS DynamoDB
    """

    def __init__(self, table_name):
        """Constructor

        Args:
            table_name (str): Table name in DynamoDB service
        """
        self.table_name = table_name
        self.dynamodb = boto3.client('dynamodb','us-east-1')

    def store_card(self, card: BusinessCard):
        """Creates a new card record

        Args:
            card (BusinessCard): Card to be included in the DynamoBD

        Returns:
            bool: Operation result
        """

        # Ensure primary key - low collision
        card.card_id = str(uuid.uuid4())

        response = self.dynamodb.put_item(
            TableName=self.table_name,
            Item=card.toDynamoFormat()
        )
        return response['ResponseMetadata']['HTTPStatusCode'] == 200

    def update_card(self, card: BusinessCard):
        """Updates a new card record

        Args:
            card (BusinessCard): Card to be updated in the DynamoBD

        Returns:
            bool: Operation result
        """
        response = self.dynamodb.update_item(
            TableName=self.table_name,
            Key={'user_id': {'S': str(card.user_id)}, 'card_id': {
                'S': str(card.card_id)}},
            AttributeUpdates=card.toDynamoFormat(isUpdate=True),
            ReturnValues='ALL_NEW'
        )
        return response['ResponseMetadata']['HTTPStatusCode'] == 200

    def delete_card(self, user_id, card_id):
        """Deletes a card record in DynamoDB

        Args:
            user_id (str): User unique identifier
            card_id (str): Card unique identifier

        Returns:
            bool: Operation result, true if card does not exist
        """
        response = self.dynamodb.delete_item(
            TableName=self.table_name,
            Key={'user_id': {'S': str(user_id)}, 'card_id': {
                'S': str(card_id)}}
        )
        return response['ResponseMetadata']['HTTPStatusCode'] == 200

    def get_card(self, user_id, card_id):
        """Retrieves card information from DynamoDB

        Args:
            user_id (str): User unique identifier
            card_id (str): Card unique identifier

        Returns:
            BusinessCard: Card information, None if card_id does not exists
        """
        response = self.dynamodb.get_item(
            TableName=self.table_name,
            Key={'user_id': {'S': str(user_id)}, 'card_id': {
                'S': str(card_id)}}
        )

        c = None
        if response.__contains__('Item'):
            c = BusinessCard(
                user_id=response['Item']['user_id']['S'],
                card_id=response['Item']['card_id']['S'],
                names=response['Item']['card_names']['S'],
                email_addresses=response['Item']['email_addresses']['SS'],
                telephone_numbers=response['Item']['telephone_numbers']['NS'],
                company_name=response['Item']['company_name']['S'],
                company_website=response['Item']['company_website']['S'],
                company_address=response['Item']['company_address']['S'],
                image_storage=response['Item']['image_storage']['S'],
            )
        return c

    def search_cards(self, user_id, filter='', page=1, pagesize=10):
        """Method for searching the cards of a particular user.
        It takes into account the page number and pagesize to retrieve the appropriate elements
        ordering the results first by card names.

        To search all items filter should be None or empty string

        Args:
            user_id (str): User unique identifier
            filter (str, optional): Filter criteria for names, email, company name, website or address. Defaults to None.
            page (int, optional): Page number to retrieve. Defaults to 1.
            pagesize (int, optional): Number of records per page. Defaults to 10.

        Returns:
            BusinessCardList: Object that encapsulates a list of BusinessCard and metadata for pagination purposes
        """

        if not user_id:
            raise ValueError('user_id is a mandatory field')

        if filter != None and filter != '':
            response = self.dynamodb.query(
                TableName=self.table_name,
                KeyConditionExpression='user_id = :user_id',
                # If specific columns needs to be displayed in the list view
                # ProjectionExpression="card_id, card_names, email_addresses, company_name",

                FilterExpression='contains(card_names,:filter_criteria) OR '\
                'contains(email_addresses,:filter_criteria) OR '\
                'contains(company_name,:filter_criteria) OR '\
                'contains(company_website,:filter_criteria) OR '\
                'contains(company_address,:filter_criteria) ',
                ExpressionAttributeValues={
                    ':user_id': {'S': user_id},
                    ':filter_criteria': {'S': filter}
                },
            )
        else:
            # Empty search case
            response = self.dynamodb.query(
                TableName=self.table_name,
                KeyConditionExpression='user_id = :user_id',
                ExpressionAttributeValues={
                    ':user_id': {'S': user_id},
                },
            )


        print(response)
        return response
        # return BusinessCardList(response, 1, 10)
