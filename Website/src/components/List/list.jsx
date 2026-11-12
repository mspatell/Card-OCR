import React, { useEffect, useState } from "react";
import AppLayout from "@cloudscape-design/components/app-layout";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Pagination from "@cloudscape-design/components/pagination";
import Modal from "@cloudscape-design/components/modal";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Box from "@cloudscape-design/components/box";
import Alert from "@cloudscape-design/components/alert";
import Flashbar from "@cloudscape-design/components/flashbar";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const EMPTY_CARD = { name: "", phone: "", email: "", website: "", address: "" };

const api = {
  fetch: async (lastKey = null) => {
    const user_id = localStorage.getItem("user_sub");
    const url = lastKey
      ? `${serverUrl}/cards/${user_id}?last_key=${encodeURIComponent(lastKey)}`
      : `${serverUrl}/cards/${user_id}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();
    return {
      items: (data.items || []).map((item, i) => ({
        id: i + 1, card_id: item.card_id || "", name: item.name || "",
        phone: item.phone || "", email: item.email || "",
        website: item.website || "", address: item.address || "",
      })),
      nextKey: data.last_key || null,
    };
  },
  create: async (card) => {
    const user_id = localStorage.getItem("user_sub");
    const res = await fetch(`${serverUrl}/cards`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        card_id: null, user_id, user_names: card.name || "Unknown",
        telephone_numbers: card.phone ? [card.phone] : [""],
        email_addresses: card.email ? [card.email] : [""],
        company_name: card.name || "", company_website: card.website || "",
        company_address: card.address || "", image_storage: "",
      }),
    });
    if (!res.ok) throw new Error("Failed to create");
    return res.json();
  },
  update: async (card) => {
    const user_id = localStorage.getItem("user_sub");
    const res = await fetch(`${serverUrl}/cards`, {
      method: "PUT",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, ...card }),
    });
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  },
  delete: async (card) => {
    const user_id = localStorage.getItem("user_sub");
    const res = await fetch(`${serverUrl}/cards/${user_id}/${card.card_id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete");
    return res.json();
  },
};

const COLUMNS = [
  { id: "name", header: "Name", cell: (i) => i.name, sortingField: "name" },
  { id: "phone", header: "Phone", cell: (i) => i.phone },
  { id: "email", header: "Email", cell: (i) => i.email },
  { id: "website", header: "Website", cell: (i) => i.website },
  { id: "address", header: "Address", cell: (i) => i.address },
];

function List() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState([]);
  const [cursorStack, setCursorStack] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextKey, setNextKey] = useState(null);
  const [selected, setSelected] = useState([]);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_CARD);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user_sub")) { window.location = "/login"; return; }
    load(cursorStack[currentPage - 1]);
  }, [currentPage]);

  const load = (cursor) => {
    setLoading(true);
    api.fetch(cursor)
      .then(({ items: it, nextKey: nk }) => { setItems(it); setNextKey(nk); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const notify = (msg, type = "success") => {
    const id = Date.now().toString();
    setFlash([{ type, content: msg, id, dismissible: true, onDismiss: () => setFlash([]) }]);
  };

  const handleCreate = async () => {
    setSaving(true);
    try { await api.create(form); notify("Contact added."); setCreateOpen(false); setForm(EMPTY_CARD); load(null); }
    catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try { await api.update(form); notify("Contact updated."); setEditOpen(false); load(cursorStack[currentPage - 1]); }
    catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await api.delete(selected[0]); notify("Contact deleted."); setDeleteOpen(false); setSelected([]); load(cursorStack[currentPage - 1]); }
    catch (e) { notify(e.message, "error"); }
    finally { setSaving(false); }
  };

  const openEdit = () => { setForm({ ...selected[0] }); setEditOpen(true); };
  const openDelete = () => setDeleteOpen(true);

  const handlePageChange = ({ detail }) => {
    const page = detail.currentPageIndex;
    if (page > currentPage && nextKey) {
      setCursorStack((prev) => { const u = [...prev]; if (!u[page - 1]) u[page - 1] = nextKey; return u; });
    }
    setCurrentPage(page);
  };

  const FormFields = () => (
    <SpaceBetween size="s">
      {["name", "phone", "email", "website", "address"].map((key) => (
        <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
          <Input value={form[key] || ""} onChange={({ detail }) => setForm({ ...form, [key]: detail.value })} />
        </FormField>
      ))}
    </SpaceBetween>
  );

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout header={<Header variant="h1" description="Manage your extracted business card contacts">Saved Contacts</Header>}>
          <SpaceBetween size="m">
            {flash.length > 0 && <Flashbar items={flash} />}
            {error && <Alert type="error">{error}</Alert>}

            <Table
              loading={loading}
              loadingText="Loading contacts..."
              items={items}
              columnDefinitions={COLUMNS}
              selectionType="single"
              selectedItems={selected}
              onSelectionChange={({ detail }) => setSelected(detail.selectedItems)}
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No contacts</b>
                  <Box variant="p" color="inherit">Scan a business card to get started.</Box>
                </Box>
              }
              header={
                <Header
                  counter={`(${items.length})`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button onClick={() => { setForm(EMPTY_CARD); setCreateOpen(true); }} iconName="add-plus">Add manually</Button>
                      <Button onClick={openEdit} disabled={selected.length === 0} iconName="edit">Edit</Button>
                      <Button onClick={openDelete} disabled={selected.length === 0} iconName="remove">Delete</Button>
                    </SpaceBetween>
                  }
                >
                  Contacts
                </Header>
              }
              pagination={
                <Pagination
                  currentPageIndex={currentPage}
                  pagesCount={nextKey ? currentPage + 1 : currentPage}
                  onChange={handlePageChange}
                />
              }
            />
          </SpaceBetween>

          {/* Create Modal */}
          <Modal visible={createOpen} onDismiss={() => setCreateOpen(false)} header="Add Contact"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleCreate} loading={saving}>Save</Button>
                </SpaceBetween>
              </Box>
            }>
            <Form><FormFields /></Form>
          </Modal>

          {/* Edit Modal */}
          <Modal visible={editOpen} onDismiss={() => setEditOpen(false)} header="Edit Contact"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleUpdate} loading={saving}>Update</Button>
                </SpaceBetween>
              </Box>
            }>
            <Form><FormFields /></Form>
          </Modal>

          {/* Delete Modal */}
          <Modal visible={deleteOpen} onDismiss={() => setDeleteOpen(false)} header="Delete contact"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleDelete} loading={saving}>Delete</Button>
                </SpaceBetween>
              </Box>
            }>
            <Box>Are you sure you want to delete <b>{selected[0]?.name}</b>? This action cannot be undone.</Box>
          </Modal>
        </ContentLayout>
      }
    />
  );
}

export default List;
