import React, { useEffect, useState } from 'react';
import CRUDTable,
{
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from 'react-crud-table';

import "../styles/list.css"

const serverUrl = process.env.REACT_APP_SERVER_URL;

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

// const SORTERS = {
//   NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
//   NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
//   STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
//   STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
// };

// const getSorter = (data) => {
//   const mapper = x => x[data.field];
//   let sorter = SORTERS.STRING_ASCENDING(mapper);

//   if (data.field === 'id') {
//     sorter = data.direction === 'ascending' ?
//       SORTERS.NUMBER_ASCENDING(mapper) : SORTERS.NUMBER_DESCENDING(mapper);
//   } else {
//     sorter = data.direction === 'ascending' ?
//       SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
//   }

//   return sorter;
// };

const service = {
  fetchItems: async (payload) => {
    try {
      let user_id = localStorage.getItem('user_sub');
      let response = await fetch(`${serverUrl}/cards/${user_id}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      let data = await response.json();
      return Promise.resolve(data); // a promise is returned

    } catch (error) {
      console.error("Error fetching items:", error);
      return Promise.reject(error); // Return a rejected promise
    }
  },

  create: async (card) => {
    try {
      let response = await fetch(serverUrl + "/cards", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          card_id: null,
          user_id: localStorage.getItem('user_sub'),
          user_names: null,
          telephone_numbers: card.phone ? [card.phone] : [''],
          email_addresses: card.email ? [card.email] : [''],
          company_name: card.name ? card.name : '',
          company_website: card.website ? card.website : '',
          company_address: card.address ? card.address : '',
          image_storage: card.image_url ? card.image_url : ''
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create card");
      }

      let data = await response.json();
      return Promise.resolve(data); // a promise is returned

    } catch (error) {
      console.error("Error creating card:", error);
      return Promise.reject(error); // Return a rejected promise
    }
  },


  update: async (data) => {
    try {
      let user_id = localStorage.getItem('user_sub');
      data['user_id'] = user_id;

      let response = await fetch(serverUrl + "/cards", {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update card");
      }

      let updatedData = await response.json();
      return Promise.resolve(updatedData); // a promise is returned

    } catch (error) {
      console.error("Error updating card:", error);
      return Promise.reject(error); // Return a rejected promise
    }
  },


  delete: async (data) => {
    try {
      let user_id = localStorage.getItem('user_sub');
      let response = await fetch(`${serverUrl}/cards/${user_id}/${data.card_id}`, {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      let deletedData = await response.json();
      return Promise.resolve(deletedData); // a promise is returned

    } catch (error) {
      console.error("Error deleting card:", error);
      return Promise.reject(error); // Return a rejected promise
    }
  },


};

const styles = {
  container: { margin: 'auto', width: 'fit-content' },
};

function List(props) {

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user_sub')) {
      window.location = '/login'
    }
  })

  const handleSearchChange = (event) => {
    let searchTerm = event.target.value;
    setSearch(searchTerm)

    service.fetchItems();

  }

  return (
    <div>
      <div style={styles.container}>
        <div className="input-container ic1" style={{ border: "2px solid grey" }}>
          <input id="search" className="input" value={search} onChange={(e) => handleSearchChange(e)} type="text" placeholder="Search " />
        </div>
        <CRUDTable
          caption="Events"
          fetchItems={payload => service.fetchItems(payload)}
        >
          <Fields>
            <Field
              name="id"
              label="Id"
              hideInCreateForm
              readOnly
            />
            <Field
              name="name"
              label="Name"
            />
            <Field
              name="phone"
              label="Phone"
            />
            <Field
              name="email"
              label="Email"
            />
            <Field
              name="website"
              label="Website"
            />
            <Field
              name="address"
              label="address"
              render={DescriptionRenderer}
            />
          </Fields>
          <CreateForm
            title="Card Creation"
            message="Create a new card!"
            trigger="Create Card"
            onSubmit={(card) => { service.create(card) }}
            submitText="Create"
          />

          <UpdateForm
            title="Card Update Process"
            message="Update task"
            trigger="Update"
            onSubmit={card => service.update(card)}
            submitText="Update"
            validate={(values) => {
            const errors = {};

            if (!values.id) {
              errors.id = 'Please, provide id';
            }

            if (!values.name) {
              errors.title = 'Please, provide task\'s title';
            }

            if (!values.email) {
              errors.description = 'Please, provide task\'s description';
            }

            return errors;
          }}
          />

          <DeleteForm
            title="Card Delete Process"
            message="Are you sure you want to delete the task?"
            trigger="Delete"
            onSubmit={task => service.delete(task)}
            submitText="Delete"
            validate={(values) => {
              const errors = {};
              if (!values.id) {
                errors.id = 'Please, provide id';
              }
              return errors;
            }}
          />
        </CRUDTable>
      </div>
    </div>
  );
}

export default List;