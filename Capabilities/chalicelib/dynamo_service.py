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
            # Handle telephone_numbers which could be SS (string set) or NS (number set)
            telephone_numbers = []
            if 'telephone_numbers' in response['Item']:
                if 'SS' in response['Item']['telephone_numbers']:
                    telephone_numbers = response['Item']['telephone_numbers']['SS']
                elif 'NS' in response['Item']['telephone_numbers']:
                    telephone_numbers = response['Item']['telephone_numbers']['NS']
                    
            c = BusinessCard(
                user_id=response['Item']['user_id']['S'],
                card_id=response['Item']['card_id']['S'],
                names=response['Item'].get('card_names', {}).get('S', ''),
                email_addresses=response['Item'].get('email_addresses', {}).get('SS', []),
                telephone_numbers=telephone_numbers,
                company_name=response['Item'].get('company_name', {}).get('S', ''),
                company_website=response['Item'].get('company_website', {}).get('S', ''),
                company_address=response['Item'].get('company_address', {}).get('S', ''),
                image_storage=response['Item'].get('image_storage', {}).get('S', ''),
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
            dict: DynamoDB response containing Items list
        """

        if not user_id:
            raise ValueError('user_id is a mandatory field')
            
        try:
            print(f"Searching cards for user_id: {user_id}")
            
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
                print(f"Querying table: {self.table_name} for user_id: {user_id}")
                response = self.dynamodb.query(
                    TableName=self.table_name,
                    KeyConditionExpression='user_id = :user_id',
                    ExpressionAttributeValues={
                        ':user_id': {'S': user_id},
                    },
                )

            print(f"DynamoDB response: {response}")
            
            # Check if we have items in the response
            if 'Items' not in response:
                print("No 'Items' key in DynamoDB response")
                # Try to list tables to verify connection
                tables = self.dynamodb.list_tables()
                print(f"Available tables: {tables}")
            elif len(response['Items']) == 0:
                print(f"'Items' array is empty in DynamoDB response for user_id: {user_id}")
                # Verify the table exists and has the expected structure
                try:
                    table_desc = self.dynamodb.describe_table(TableName=self.table_name)
                    print(f"Table description: {table_desc}")
                    # Try a scan to see if there's any data at all
                    scan_result = self.dynamodb.scan(TableName=self.table_name, Limit=5)
                    print(f"Scan result (first 5 items): {scan_result}")
                except Exception as e:
                    print(f"Error checking table: {e}")
                
            return response
            
        except Exception as e:
            print(f"Error in search_cards: {e}")
            # Return an empty response structure instead of raising an exception
            return {'Items': []}
