from pprint import pprint
from chalicelib.dynamo_service import DynamoService
from chalicelib.business_card import BusinessCard

dynamo = DynamoService('BusinessCardsTable')

### CREATE DUMMY DATA

# for idx in range(1,11,1):
#     card = BusinessCard(f'nromerol', 0, f'Nero{idx}', [55567890], [
#                     'nromerol@nerocorp.com'], f'NeroCorp{idx}', 'www.nero.com.co', f'123-{idx} address road', f'bucket/img-{idx}')
#     response = dynamo.store_card(card)
#     print('Card Created')
#     pprint(response)

### SEARCH FUNCTIONALITY 
# ps = 4
# cards = dynamo.search_cards('nromerol', 'nero', 1, ps)
# print(cards.get_list())
# cards = dynamo.search_cards('nromerol', 'nero', 2, ps)
# print(cards.get_list())
# cards = dynamo.search_cards('nromerol', 'nero', 3, ps)
# print(cards.get_list())
# cards = dynamo.search_cards('nromerol', 'nero', 4, 0)
# print(cards.get_list())
# cards = dynamo.search_cards('nromerol', 'nero', 2, 40)
# print(cards.get_list())

cards = dynamo.search_cards('nromerol', None, 1, 40)
print(cards.get_list())

### GET CARD FUNCTIONALITY
# card = dynamo.get_card('nromerol', '0beb8abb-db4b-4eb0-9da7-c3e1714649f0')
# print('Card Retrieved')
# pprint(card)

### CREATE CARD FUNCTIONALITY
# card = BusinessCard('pparker', 0, 'Peter Parker', [555678902], 
#                         ['peter@spidey.com'], 'Spiderman Corp', 'www.spiderman.com', '9987 friendly road',
#                         'bucket//123//img.123')
# response = dynamo.store_card(card)
# print('Card New Created')
# pprint(response)
# pprint(card.card_id)

### UPDATE CARD FUNCTIONALITY
# card.company_name = 'COMP258_Spidey'
# response = dynamo.update_card(card)
# print('Card Updated')
# pprint(response)

### DELETE CARD FUNCTIONALITY
# response = dynamo.delete_card('pparker','d048ac1b-7b41-4d84-8c4f-dafe4722757d')
# print('Card Removed')
# pprint(response)