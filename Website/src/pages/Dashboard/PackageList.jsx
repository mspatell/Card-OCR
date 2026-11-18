import React, { useEffect, useState } from "react";
import AppLayout from "@cloudscape-design/components/app-layout";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Alert from "@cloudscape-design/components/alert";

const PACKAGE_API_URL = process.env.REACT_APP_PACKAGE_API_URL;

const COLUMNS = [
  { id: "first_name",  header: "First Name",  cell: (i) => i.first_name },
  { id: "last_name",   header: "Last Name",   cell: (i) => i.last_name },
  { id: "unit_number", header: "Unit Number", cell: (i) => i.unit_number },
  { id: "created_at",  header: "Created At",  cell: (i) => new Date(i.created_at).toLocaleString(), sortingField: "created_at" },
];

function PackageList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) { window.location = "/login"; return; }
    fetch(`${PACKAGE_API_URL}/packages/${user_id}`)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout header={<Header variant="h1" description="All logged package deliveries">Logged Packages</Header>}>
          {error && <Alert type="error">{error}</Alert>}
          <Table
            loading={loading}
            loadingText="Loading packages..."
            items={items}
            columnDefinitions={COLUMNS}
            sortingColumn={{ sortingField: "created_at" }}
            sortingDescending
            empty={
              <Box textAlign="center" color="inherit">
                <b>No packages logged yet</b>
              </Box>
            }
            header={<Header counter={`(${items.length})`}>Packages</Header>}
          />
        </ContentLayout>
      }
    />
  );
}

export default PackageList;
