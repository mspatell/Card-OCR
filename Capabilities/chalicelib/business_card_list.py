from math import ceil
from chalicelib.business_card import BusinessCard

class BusinessCardList:
    """This class encapsulates a list of BusinessCard objects and stores
    control information for pagination purpuses
    """
    def __init__(self, search_result, page, pagesize):
        """Constructor

        Args:
            search_result (dict): this is the raw result received from a call to dynamodb scan api
            page (int): Page number requested
            pagesize (int): Number of items per page
        """
        self.raw_result = search_result
        self.cards = []
        self.page = int(page)
        self.pagesize = int(pagesize)
        self.count = 0
        self.numpages = 0

        # Create card object list
        self.__build_list()

    def __build_list(self):
        """Internal method for extracting information from dynamodb results and
        create BusinessCard objects with pagination
        """
        items = self.raw_result['Items']
        self.count = int(self.raw_result['Count'])

        # Extract card information
        for item in items:

            c = BusinessCard()

            if item.__contains__('card_id'):
                c.card_id = item['card_id']['S']

            if item.__contains__('user_id'):
                c.user_id = item['user_id']['S']

            if item.__contains__('card_names'):
                c.names = item['card_names']['S']

            if item.__contains__('telephone_numbers'):
                c.telephone_numbers = item['telephone_numbers']['SS']

            if item.__contains__('email_addresses'):
                c.email_addresses = item['email_addresses']['SS']

            if item.__contains__('company_name'):
                c.company_name = item['company_name']['S']

            if item.__contains__('company_website'):
                c.company_website = item['company_website']['S']

            if item.__contains__('company_address'):
                c.company_address = item['company_address']['S']

            self.cards.append(c)

        # Sort cards by person name
        self.cards.sort(key=lambda x: x.names)

        # Calculate indexes for pagination in sorted results
        start_index = 0
        end_index = 0

        if self.pagesize > self.count:
            self.pagesize = self.count

        if self.pagesize and self.pagesize > 0:
            numpages = ceil(self.count/self.pagesize)
            self.numpages = numpages
            if self.page > numpages or self.page == 0:
                self.page = 1

            end_index = (self.pagesize * self.page)
            if end_index > self.count:
                end_index = self.count
            start_index = (self.pagesize * (self.page-1))

        # Retrieve elements by index bounds
        self.cards = self.cards[start_index:end_index]

        # print(start_index, ' ', end_index)


    def get_list(self):
        """Return the list of BusinessCard objects

        Returns:
            BusinessCard[]: List of cards
        """
        return self.cards

    def get_count(self):
        """Returns the total number of results in the search before pagination

        Returns:
            int: Total number of records returned by the search
        """
        return self.count

    def get_numpages(self):
        """Returns the number of available pages in the results

        Returns:
            int: Number of pages in the results
        """
        return self.numpages
