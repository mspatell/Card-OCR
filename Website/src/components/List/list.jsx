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
      const response = await fetch(`${serverUrl}/cards/${user_id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      return Promise.reject(error);
    }
  },

  create: async (card) => {
    try {
      const response = await fetch(`${serverUrl}/cards`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: null,
          user_id: localStorage.getItem('user_sub'),
          user_names: null,
          telephone_numbers: card.phone ? [card.phone] : [''],
          email_addresses: card.email ? [card.email] : [''],
          company_name: card.name || '',
          company_website: card.website || '',
          company_address: card.address || '',
          image_storage: card.image_url || '',
        }),
      });
      if (!response.ok) throw new Error('Failed to create card');
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      console.error('Error creating card:', error);
      return Promise.reject(error);
    }
  },

  update: async (data) => {
    try {
      data.user_id = localStorage.getItem('user_sub');
      const response = await fetch(`${serverUrl}/cards`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update card');
      const updatedData = await response.json();
      return Promise.resolve(updatedData);
    } catch (error) {
      console.error('Error updating card:', error);
      return Promise.reject(error);
    }
  },

  delete: async (data) => {
    try {
      const user_id = localStorage.getItem('user_sub');
      const response = await fetch(`${serverUrl}/cards/${user_id}/${data.card_id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete card');
      const deletedData = await response.json();
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

  useEffect(() => {
    if (!localStorage.getItem('user_sub')) {
      window.location = '/login';
    } else {
      service.fetchItems().then(setAllItems).catch(console.error);
    }
  }, []);

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
        <CRUDTable
          caption="Cards"
          // fetchItems={() => Promise.resolve(filteredItems)}
        >
          <Fields>
            <Field name="card_id" label="Id" hideInCreateForm readOnly />
            <Field name="company_name" label="Name" />
            <Field name="telephone_numbers" label="Phone" />
            <Field name="email_addresses" label="Email" />
            <Field name="company_website" label="Website" />
            <Field name="company_address" label="Address" render={DescriptionRenderer} />
          </Fields>

          <CreateForm
            title="Create Card"
            message="Create a new card!"
            trigger="Create Card"
            onSubmit={(card) => service.create(card).then(() => service.fetchItems().then(setAllItems))}
            submitText="Create"
          />

          <UpdateForm
            title="Update Card"
            message="Update card details"
            trigger="Update"
            onSubmit={(card) => service.update(card).then(() => service.fetchItems().then(setAllItems))}
            submitText="Update"
            validate={(values) => {
              const errors = {};
              if (!values.card_id) errors.card_id = 'Please provide card id';
              if (!values.company_name) errors.company_name = 'Please provide company name';
              if (!values.email_addresses || values.email_addresses.length === 0) errors.email_addresses = 'Please provide email';
              return errors;
            }}
          />

          <DeleteForm
            title="Delete Card"
            message="Are you sure you want to delete this card?"
            trigger="Delete"
            onSubmit={(card) => service.delete(card).then(() => service.fetchItems().then(setAllItems))}
            submitText="Delete"
            validate={(values) => {
              const errors = {};
              if (!values.card_id) errors.card_id = 'Please provide card id';
              return errors;
            }}
          />
        </CRUDTable>
      </div>
    </div>
  );
}

export default List;