import React, { useState } from 'react';
import { EditableTable, type EditableTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
};

const initialData: Employee[] = [
    { id: '1', firstName: 'Alice', lastName: 'Martin', role: 'Engineer', department: 'R&D' },
    { id: '2', firstName: 'Bob', lastName: 'Chen', role: 'Designer', department: 'Product' },
    { id: '3', firstName: 'Carol', lastName: 'Davis', role: 'Manager', department: 'Operations' },
];

const columns: Array<EditableTableColumnDef<Employee>> = [
    { accessorKey: 'id', header: 'ID', enableEditing: false, size: 70 },
    { accessorKey: 'firstName', header: 'First Name', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'lastName', header: 'Last Name', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'role', header: 'Role', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'department', header: 'Department' },
];

const validate = (row: Employee): Partial<Record<keyof Employee, string | undefined>> => ({
    firstName: !row.firstName ? 'First name is required' : undefined,
    lastName: !row.lastName ? 'Last name is required' : undefined,
    role: !row.role ? 'Role is required' : undefined,
});

export const RowEditingEditableTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Employee[]>(initialData);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            <EditableTable
                columns={columns}
                data={data}
                editDisplayMode="row"
                createDisplayMode="row"
                onValidate={validate}
                onCreate={(row): void => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                enableDuplicate
                createButtonText="Add Employee"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
