import React, { useEffect, useState } from "react";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from "react-crud-table";

import "./list.css";

const serverUrl = process.env.REACT_APP_SERVER_URL;
const DescriptionRenderer = ({ field }) => <textarea {...field} />;

const service = {
  fetchItems: async (lastKey = null) => {
    const user_id = localStorage.getItem("user_sub");
    const url = lastKey
      ? `${serverUrl}/cards/${user_id}?last_key=${encodeURIComponent(lastKey)}`
      : `${serverUrl}/cards/${user_id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch items: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("API response:", JSON.stringify(data));
    const items = (data.items || []).map((item, index) => ({
      id: index + 1,
      card_id: item.card_id || "",
      name: item.name || "",
      phone: item.phone || "",
      email: item.email || "",
      website: item.website || "",
      address: item.address || "",
      image_storage: item.image_storage || "",
    }));

    return { items, nextKey: data.last_key || null };
  },

  create: async (card) => {
    try {
      const user_id = localStorage.getItem("user_sub");
      const payload = {
        card_id: null,
        user_id: user_id,
        user_names: card.name || "Unknown",
        telephone_numbers: card.phone ? [card.phone] : [""],
        email_addresses: card.email ? [card.email] : [""],
        company_name: card.name || "",
        company_website: card.website || "",
        company_address: card.address || "",
        image_storage: "",
      };

      console.log("Creating card with data:", payload);

      const response = await fetch(`${serverUrl}/cards`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create card");
      const data = await response.json();

      // Force a small delay to ensure the backend has processed the request
      await new Promise((resolve) => setTimeout(resolve, 500));

      return Promise.resolve(data);
    } catch (error) {
      console.error("Error creating card:", error);
      return Promise.reject(error);
    }
  },

  update: async (data) => {
    try {
      const user_id = localStorage.getItem("user_sub");
      // Map the data back to the format expected by the backend
      const payload = {
        user_id: user_id,
        card_id: data.card_id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        image_storage: data.image_storage || "",
      };

      console.log("Updating card with data:", payload);

      const response = await fetch(`${serverUrl}/cards`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update card");
      const updatedData = await response.json();

      // Force a small delay to ensure the backend has processed the request
      await new Promise((resolve) => setTimeout(resolve, 500));

      return Promise.resolve(updatedData);
    } catch (error) {
      console.error("Error updating card:", error);
      return Promise.reject(error);
    }
  },

  delete: async (data) => {
    try {
      const user_id = localStorage.getItem("user_sub");
      console.log("Deleting card:", data);

      // Make sure we have the card_id
      if (!data.card_id) {
        throw new Error("Card ID is required for deletion");
      }

      const response = await fetch(
        `${serverUrl}/cards/${user_id}/${data.card_id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete card: ${response.status} ${errorText}`
        );
      }

      const deletedData = await response.json();

      // Force a small delay to ensure the backend has processed the request
      await new Promise((resolve) => setTimeout(resolve, 500));

      return Promise.resolve(deletedData);
    } catch (error) {
      console.error("Error deleting card:", error);
      return Promise.reject(error);
    }
  },
};

const styles = { container: { margin: "auto", width: "fit-content" } };

function List() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  // cursor stack: index 0 = first page (null), each push = next page's key
  const [cursorStack, setCursorStack] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextKey, setNextKey] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("user_sub")) {
      window.location = "/login";
      return;
    }
    setLoading(true);
    console.log("Fetching page", currentPage, "cursor:", cursorStack[currentPage]);
    service
      .fetchItems(cursorStack[currentPage])
      .then(({ items, nextKey: nk }) => {
        setAllItems(items || []);
        setNextKey(nk);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
        setLoading(false);
      });
  }, [currentPage, cursorStack, refreshKey]);

  const handleNext = () => {
    if (!nextKey) return;
    setCursorStack((prev) => {
      const updated = [...prev];
      if (!updated[currentPage + 1]) updated[currentPage + 1] = nextKey;
      return updated;
    });
    setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage === 0) return;
    setCurrentPage((p) => p - 1);
  };

  const handleRefresh = () => {
    setCursorStack([null]);
    setCurrentPage(0);
    setNextKey(null);
    setRefreshKey((k) => k + 1);
  };

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
        {loading ? (
          <div>Loading cards...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : allItems.length === 0 && currentPage === 0 ? (
          <div>No cards found. Try adding some cards first.</div>
        ) : (
          <>
          <CRUDTable
            caption="Contact List"
            fetchItems={() => Promise.resolve(allItems)}
          >
            <Fields>
              <Field name="id" label="Id" hideInCreateForm readOnly />
              <Field name="name" label="Name" />
              <Field name="phone" label="Phone" />
              <Field name="email" label="Email" />
              <Field name="website" label="Website" />
              <Field
                name="address"
                label="Address"
                render={DescriptionRenderer}
              />
            </Fields>

            <CreateForm
              title="Add Mannual Contact"
              message="Enter information"
              trigger="Add Mannually"
              onSubmit={(card) => {
                return service.create(card).then(() => {
                  handleRefresh();
                  return { ...card };
                });
              }}
              submitText="Save"
            />

            <UpdateForm
              title="Update Card"
              message="Update card details"
              trigger="Update"
              onSubmit={(card) => {
                return service.update(card).then(() => {
                  handleRefresh();
                  return { ...card };
                });
              }}
              submitText="Update"
              validate={(values) => {
                const errors = {};
                if (!values.card_id) errors.card_id = "Please provide card id";
                if (!values.name) errors.name = "Please provide name";
                if (!values.email) errors.email = "Please provide email";
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
                  alert("Card ID is missing. Cannot delete this card.");
                  return Promise.reject("Card ID is missing");
                }
                return service.delete(card).then(() => {
                  handleRefresh();
                  return {};
                });
              }}
              submitText="Delete"
              validate={(values) => {
                const errors = {};
                if (!values.card_id) errors.card_id = "Please provide card id";
                return errors;
              }}
            />
          </CRUDTable>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", margin: "16px 0" }}>
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="crud-button crud-button--primary"
            >
              ← Prev
            </button>
            <span style={{ lineHeight: "2rem" }}>Page {currentPage + 1}</span>
            <button
              onClick={handleNext}
              disabled={!nextKey}
              className="crud-button crud-button--primary"
            >
              Next →
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default List;
