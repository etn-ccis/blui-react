import React, { useState } from 'react';
import { EditableTable, type EditableTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
};

const initialData: Product[] = [
    { id: '1', name: 'Widget A', quantity: 10, price: 4.99 },
    { id: '2', name: 'Widget B', quantity: 5, price: 12.5 },
    { id: '3', name: 'Widget C', quantity: 20, price: 1.75 },
];

const columns: Array<EditableTableColumnDef<Product>> = [
    { accessorKey: 'id', header: 'ID', enableEditing: false, size: 70 },
    { accessorKey: 'name', header: 'Name', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'quantity', header: 'Qty', size: 90, muiEditTextFieldProps: { type: 'number', required: true } },
    { accessorKey: 'price', header: 'Price ($)', size: 110, muiEditTextFieldProps: { type: 'number', required: true } },
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
