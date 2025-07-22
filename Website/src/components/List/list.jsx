import React, { useEffect, useState } from 'react';
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from 'react-crud-table';

import './list.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const DescriptionRenderer = ({ field }) => <textarea {...field} />;

const service = {
  fetchItems: async () => {
    try {
      const user_id = localStorage.getItem('user_sub');
      console.log('Fetching cards for user:', user_id);
      console.log('Using server URL:', serverUrl);
      
      const response = await fetch(`${serverUrl}/cards/${user_id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch items: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Ensure we have an array even if the backend returns something else
      if (!Array.isArray(data)) {
        console.warn('Backend did not return an array, converting to empty array');
        return [];
      }
      
      // Map the data to match the field names expected by the CRUDTable
      const mappedData = data.map((item, index) => ({
        id: index + 1,  // Use sequential numbers for id
        card_id: item.card_id || '',
        name: item.name || '',
        phone: item.phone || '',
        email: item.email || '',
        website: item.website || '',
        address: item.address || '',
        image_storage: item.image_storage || ''
      }));
      
      console.log('Mapped data:', mappedData);
      return Promise.resolve(mappedData);
    } catch (error) {
      console.error('Error fetching items:', error);
      return Promise.reject(error);
    }
  },

  create: async (card) => {
    try {
      const user_id = localStorage.getItem('user_sub');
      const payload = {
        card_id: null,
        user_id: user_id,
        user_names: card.name || 'Unknown',
        telephone_numbers: card.phone ? [card.phone] : [''],
        email_addresses: card.email ? [card.email] : [''],
        company_name: card.name || '',
        company_website: card.website || '',
        company_address: card.address || '',
        image_storage: ''
      };
      
      console.log('Creating card with data:', payload);
      
      const response = await fetch(`${serverUrl}/cards`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create card');
      const data = await response.json();
      
      // Force a small delay to ensure the backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve(data);
    } catch (error) {
      console.error('Error creating card:', error);
      return Promise.reject(error);
    }
  },

  update: async (data) => {
    try {
      const user_id = localStorage.getItem('user_sub');
      // Map the data back to the format expected by the backend
      const payload = {
        user_id: user_id,
        card_id: data.card_id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        image_storage: data.image_storage || ''
      };
      
      console.log('Updating card with data:', payload);
      
      const response = await fetch(`${serverUrl}/cards`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update card');
      const updatedData = await response.json();
      
      // Force a small delay to ensure the backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve(updatedData);
    } catch (error) {
      console.error('Error updating card:', error);
      return Promise.reject(error);
    }
  },

  delete: async (data) => {
    try {
      const user_id = localStorage.getItem('user_sub');
      console.log('Deleting card:', data);
      
      // Make sure we have the card_id
      if (!data.card_id) {
        throw new Error('Card ID is required for deletion');
      }
      
      const response = await fetch(`${serverUrl}/cards/${user_id}/${data.card_id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete card: ${response.status} ${errorText}`);
      }
      
      const deletedData = await response.json();
      
      // Force a small delay to ensure the backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve(deletedData);
    } catch (error) {
      console.error('Error deleting card:', error);
      return Promise.reject(error);
    }
  },
};

const styles = { container: { margin: 'auto', width: 'fit-content' } };

function List() {
  // const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add a key to force re-renders

  // Fetch data whenever refreshKey changes
  useEffect(() => {
    if (!localStorage.getItem('user_sub')) {
      window.location = '/login';
    } else {
      setLoading(true);
      service.fetchItems()
        .then(data => {
          console.log('Fetched items:', data);
          setAllItems(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching items:', err);
          setError(err.message || 'Failed to load data');
          setLoading(false);
        });
    }
  }, [refreshKey]); // Add refreshKey as a dependency

  // const handleSearchChange = (e) => setSearch(e.target.value);

  // const filteredItems = allItems.filter(
  //   (item) =>
  //     item.company_name?.toLowerCase().includes(search.toLowerCase()) ||
  //     item.telephone_numbers?.some((num) => num.includes(search)) ||
  //     item.email_addresses?.some((email) => email.toLowerCase().includes(search.toLowerCase()))
  // );

  return (
    <div>
      <div style={styles.container}>
        {/* <div className="input-container ic1" style={{ border: '2px solid grey' }}>
          <input
            id="search"
            className="input"
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search"
          />
        </div> */}
        {loading ? (
          <div>Loading cards...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : allItems.length === 0 ? (
          <div>No cards found. Try adding some cards first.</div>
        ) : (
          <CRUDTable
            caption="Cards"
            fetchItems={() => Promise.resolve(allItems)}
          >
          <Fields>
            <Field name="id" label="Id" hideInCreateForm readOnly />
            <Field name="name" label="Name" />
            <Field name="phone" label="Phone" />
            <Field name="email" label="Email" />
            <Field name="website" label="Website" />
            <Field name="address" label="Address" render={DescriptionRenderer} />
          </Fields>

          <CreateForm
            title="Create Card"
            message="Create a new card!"
            trigger="Create Card"
            onSubmit={(card) => {
              return service.create(card)
                .then(() => {
                  // Force a refresh by incrementing the refreshKey
                  setRefreshKey(prevKey => prevKey + 1);
                  return { ...card };
                });
            }}
            submitText="Create"
          />

          <UpdateForm
            title="Update Card"
            message="Update card details"
            trigger="Update"
            onSubmit={(card) => {
              return service.update(card)
                .then(() => {
                  // Force a refresh by incrementing the refreshKey
                  setRefreshKey(prevKey => prevKey + 1);
                  return { ...card };
                });
            }}
            submitText="Update"
            validate={(values) => {
              const errors = {};
              if (!values.card_id) errors.card_id = 'Please provide card id';
              if (!values.name) errors.name = 'Please provide name';
              if (!values.email) errors.email = 'Please provide email';
              return errors;
            }}
          />

          <DeleteForm
            title="Delete Card"
            message="Are you sure you want to delete this card?"
            trigger="Delete"
            onSubmit={(card) => {
              // Make sure we have the card_id from the selected row
              if (!card.card_id) {
                alert('Card ID is missing. Cannot delete this card.');
                return Promise.reject('Card ID is missing');
              }
              return service.delete(card)
                .then(() => {
                  // Force a refresh by incrementing the refreshKey
                  setRefreshKey(prevKey => prevKey + 1);
                  // Return an empty object to indicate success
                  return {};
                });
            }}
            submitText="Delete"
            validate={(values) => {
              const errors = {};
              if (!values.card_id) errors.card_id = 'Please provide card id';
              return errors;
            }}
          />
        </CRUDTable>
        )}
      </div>
    </div>
  );
}

export default List;