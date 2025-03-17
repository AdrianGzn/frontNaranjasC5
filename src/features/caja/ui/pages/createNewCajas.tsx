import React, { useState, useEffect } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";

import { SelectButton } from 'primereact/selectbutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Product {
  code: string;
  name: string;
  category: string;
  quantity: number;
}

export default function CreateNewCajas() {
  const [size, setSize] = useState<'small' | 'large' | 'normal' | undefined>('normal');
  const [products, setProducts] = useState<Product[]>([]);

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];

  useEffect(() => {
    setProducts([
      { code: 'P001', name: 'Product 1', category: 'Category 1', quantity: 10 },
      { code: 'P002', name: 'Product 2', category: 'Category 2', quantity: 20 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
      { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 },
    ]);
  }, []);

  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col">
          <div className="w-[80%] h-[100px] m-5 flex flex-col items-center bg-white p-5">
            <SelectButton
              value={size}
              onChange={(e) => setSize(e.value)}
              options={sizeOptions}
            />

            <DataTable
              value={products}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              size={size}
              tableStyle={{ maxWidth: '50rem' }}
            >
              <Column field="code" header="Code" />
              <Column field="name" header="Name" />
              <Column field="category" header="Category" />
              <Column field="quantity" header="Quantity" />
            </DataTable>
          </div>
        </div>
      </Dashboard>
    </div>
  );
}
