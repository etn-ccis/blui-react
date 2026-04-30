import React, { useState } from 'react';
import { EditableTable, type EditableTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    inStock: boolean;
};

const initialData: Product[] = [
    { id: '1', name: 'Widget A', quantity: 10, price: 4.99, inStock: true },
    { id: '2', name: 'Widget B', quantity: 5, price: 12.5, inStock: false },
    { id: '3', name: 'Widget C', quantity: 20, price: 1.75, inStock: true },
];

const columns: Array<EditableTableColumnDef<Product>> = [
    { accessorKey: 'id', header: 'ID', cellType: 'text', enableEditing: false, size: 70 },
    { accessorKey: 'name', header: 'Name', cellType: 'text' },
    { accessorKey: 'quantity', header: 'Qty', cellType: 'number', size: 90 },
    { accessorKey: 'price', header: 'Price ($)', cellType: 'number', size: 110 },
    {
        accessorKey: 'inStock',
        header: 'In Stock',
        cellType: 'binary',
        size: 100,
    },
];

const validate = (row: Product): Partial<Record<keyof Product, string | undefined>> => ({
    name: !row.name ? 'Name is required' : undefined,
    quantity: row.quantity < 0 ? 'Must be ≥ 0' : undefined,
    price: row.price < 0 ? 'Must be ≥ 0' : undefined,
});

export const BasicEditableTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Product[]>(initialData);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            <EditableTable
                columns={columns}
                data={data}
                onValidate={validate}
                onCreate={(row): void => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                createButtonText="Add Product"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
