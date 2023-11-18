import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AppContext } from "@/AppContext";

export default function Home() {
  const { products, categories } = useContext(AppContext);

  const categoryBodyTemplate = (rowData) => {
    const category = categories.find((c) => c.Id === rowData.CategoryId);
    return category ? category.Name : "Bulunamadı";
  };
  const router = useRouter();

  const onRowSelect = (e) => {
    router.push(`/products/${e.data.Id}`);
  };

  if (!products) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <DataTable
        value={products}
        tableStyle={{ minWidth: "50rem" }}
        size="large"
        stripedRows
        onRowClick={onRowSelect}
      >
        <Column
          field="CategoryId"
          header="CategoryId"
          body={categoryBodyTemplate}
        ></Column>
        <Column field="Name" header="Name"></Column>
        <Column field="Description" header="Description"></Column>
      </DataTable>
    </>
  );
}
