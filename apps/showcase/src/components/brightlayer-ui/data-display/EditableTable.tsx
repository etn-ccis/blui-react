import React, { useState, useMemo } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { EditableTable, type EditableTableColumnDef } from '@brightlayer-ui/react-components';

const componentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    mb: 4,
};

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    state: string;
};

const initialData: User[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 30,
        state: 'California',
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        age: 25,
        state: 'New York',
    },
    {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        age: 35,
        state: 'Texas',
    },
];

/**
 * Email cell: just renders the text with padding — the gradient background
 * is applied directly on the <td> via muiTableBodyCellProps so it covers
 * the full cell including its padding area.
 */
const EmailCellRenderer: React.FC<{ email: string }> = ({ email }) => {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', px: 2, color: theme.palette.text.primary }}>
            {email}
        </Box>
    );
};

const FirstNameCellRenderer: React.FC<{ name: string }> = ({ name }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: 52,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: 2,
                    color: theme.palette.text.primary,
                    // fontWeight: 'bold',
                }}
            >
                {name}
            </Box>
        </Box>
    );
};

const states = [
    'California',
    'New York',
    'Texas',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Michigan',
];

export const EditableTableExample: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialData);
    const [isLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const theme = useTheme();
    const primaryBg = alpha(theme.palette.primary.light, 0.85);

    const columns = useMemo<Array<EditableTableColumnDef<User>>>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'firstName',
                header: 'First Name',
                muiEditTextFieldProps: {
                    required: true,
                },
                // Style the <td> directly so the background covers the entire cell
                // including its padding. padding:0 is removed here and re-added inside
                // FirstNameCellRenderer so the content is still properly inset.
                muiTableBodyCellProps: {
                    sx: {
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: primaryBg,
                    },
                },
                Cell: ({ cell }): React.ReactElement => <FirstNameCellRenderer name={cell.getValue<string>()} />,
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
                muiEditTextFieldProps: {
                    required: true,
                },
            },
            {
                accessorKey: 'age',
                header: 'Age',
                size: 88,
                muiEditTextFieldProps: {
                    type: 'number',
                    required: true,
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                },
                // Apply gradient on the <td> itself so it covers the full cell.
                // sx is a function to access theme; age drives how much is filled.
                muiTableBodyCellProps: ({ row }): { sx: (t: any) => any } => {
                    const pct = Math.min(100, Math.max(0, row.original.age));
                    return {
                        sx: (t: any): Record<string, unknown> => ({
                            padding: 0,
                            background: `linear-gradient(to right, ${alpha(t.palette.primary.main, 0.25)} ${pct}%, transparent ${pct}%)`,
                        }),
                    };
                },
                Cell: ({ cell }): React.ReactElement => <EmailCellRenderer email={cell.getValue<string>()} />,
            },
            {
                accessorKey: 'state',
                header: 'State',
                editVariant: 'select',
                editSelectOptions: states,
                muiEditTextFieldProps: {
                    select: true,
                },
                // Example: cellStyle — highlight the user's home state
                cellStyle: ({ cell }): Record<string, unknown> => ({
                    fontWeight: cell.getValue<string>() === 'California' ? 'bold' : 'normal',
                    color: cell.getValue<string>() === 'California' ? 'primary.main' : 'text.primary',
                }),
            },
        ],
        [primaryBg]
    );

    const validateUser = (user: User): Partial<Record<keyof User, string | undefined>> => {
        const errors: Partial<Record<keyof User, string | undefined>> = {};

        if (!user.firstName) {
            errors.firstName = 'First Name is required';
        }
        if (!user.lastName) {
            errors.lastName = 'Last Name is required';
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(user.email)) {
            errors.email = 'Invalid email format';
        }
        if (!user.age || user.age < 0 || user.age > 150) {
            errors.age = 'Age must be between 0 and 150';
        }
        if (!user.state) {
            errors.state = 'State is required';
        }

        return errors;
    };

    const handleCreate = async (newUser: User): Promise<void> => {
        setIsSaving(true);
        try {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            });

            setUsers([...users, { ...newUser, id: (users.length + 1).toString() }]);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (updatedUser: User): Promise<void> => {
        setIsSaving(true);
        try {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            });

            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string | number): Promise<void> => {
        setIsSaving(true);
        try {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 500);
            });

            setUsers(users.filter((u) => u.id !== id));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDuplicate = async (duplicatedUser: User): Promise<void> => {
        setIsSaving(true);
        try {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            });

            setUsers([...users, { ...duplicatedUser, id: (users.length + 1).toString() }]);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={componentContainerStyles}>
            <EditableTable
                columns={columns}
                data={users}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onValidate={validateUser}
                isLoading={isLoading}
                isSaving={isSaving}
                enableCreate={true}
                enableEdit={true}
                enableDelete={true}
                enableDuplicate={true}
                enableColumnPinning={true}
                enableRowActions={true}
                enableCellActions={true}
                enableClickToCopy="context-menu"
                createDisplayMode="row"
                editDisplayMode="cell"
                createButtonText="Add New User"
                deleteConfirmMessage={(row: User) =>
                    `Are you sure you want to delete ${row.firstName} ${row.lastName}?`
                }
                minHeight="500px"
            />
        </Box>
    );
};
