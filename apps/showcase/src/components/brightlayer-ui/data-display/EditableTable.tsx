// import React, { useState, useMemo, useCallback } from 'react';
// import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';
// import { EditableTable, type EditableTableColumnDef, type EditableTableState } from '@brightlayer-ui/react-components';

// const componentContainerStyles = {
//     display: 'flex',
//     flexDirection: 'column',
//     flex: 1,
//     mb: 4,
// };

// type User = {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     age: number;
//     state: string;
// };

// const initialData: User[] = [
//     {
//         id: '1',
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com',
//         age: 30,
//         state: 'California',
//     },
//     {
//         id: '2',
//         firstName: 'Jane',
//         lastName: 'Smith',
//         email: 'jane.smith@example.com',
//         age: 25,
//         state: 'New York',
//     },
//     {
//         id: '3',
//         firstName: 'Bob',
//         lastName: 'Johnson',
//         email: 'bob.johnson@example.com',
//         age: 35,
//         state: 'Texas',
//     },
// ];

// const states = [
//     'California',
//     'New York',
//     'Texas',
//     'Florida',
//     'Illinois',
//     'Pennsylvania',
//     'Ohio',
//     'Georgia',
//     'North Carolina',
//     'Michigan',
// ];

// export const EditableTableExample: React.FC = () => {
//     const [users, setUsers] = useState<User[]>(initialData);
//     const [isLoading] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [tableState, setTableState] = useState<EditableTableState | null>(null);

//     const columns = useMemo<Array<EditableTableColumnDef<User>>>(
//         () => [
//             {
//                 accessorKey: 'id',
//                 header: 'ID',
//                 enableEditing: false,
//                 size: 80,
//             },
//             {
//                 accessorKey: 'firstName',
//                 header: 'First Name',
//                 muiEditTextFieldProps: {
//                     required: true,
//                 },
//             },
//             {
//                 accessorKey: 'lastName',
//                 header: 'Last Name',
//                 muiEditTextFieldProps: {
//                     required: true,
//                 },
//             },
//             {
//                 accessorKey: 'age',
//                 header: 'Age',
//                 size: 88,
//                 muiEditTextFieldProps: {
//                     type: 'number',
//                     required: true,
//                 },
//             },
//             {
//                 accessorKey: 'email',
//                 header: 'Email',
//                 muiEditTextFieldProps: {
//                     type: 'email',
//                     required: true,
//                 },
//             },
//             {
//                 accessorKey: 'state',
//                 header: 'State',
//                 editVariant: 'select',
//                 editSelectOptions: states,
//                 muiEditTextFieldProps: {
//                     select: true,
//                 },
//             },
//         ],
//         []
//     );

//     const validateUser = (user: User): Partial<Record<keyof User, string | undefined>> => {
//         const errors: Partial<Record<keyof User, string | undefined>> = {};

//         if (!user.firstName) {
//             errors.firstName = 'First Name is required';
//         }
//         if (!user.lastName) {
//             errors.lastName = 'Last Name is required';
//         }
//         if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(user.email)) {
//             errors.email = 'Invalid email format';
//         }
//         if (!user.age || user.age < 0 || user.age > 150) {
//             errors.age = 'Age must be between 0 and 150';
//         }
//         if (!user.state) {
//             errors.state = 'State is required';
//         }

//         return errors;
//     };

//     const handleCreate = async (newUser: User): Promise<void> => {
//         setIsSaving(true);
//         try {
//             await new Promise<void>((resolve) => {
//                 setTimeout(resolve, 1000);
//             });

//             setUsers([...users, { ...newUser, id: (users.length + 1).toString() }]);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleUpdate = async (updatedUser: User): Promise<void> => {
//         setIsSaving(true);
//         try {
//             await new Promise<void>((resolve) => {
//                 setTimeout(resolve, 1000);
//             });

//             setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleDelete = async (id: string | number): Promise<void> => {
//         setIsSaving(true);
//         try {
//             await new Promise<void>((resolve) => {
//                 setTimeout(resolve, 500);
//             });

//             setUsers(users.filter((u) => u.id !== id));
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleDuplicate = async (duplicatedUser: User): Promise<void> => {
//         setIsSaving(true);
//         try {
//             await new Promise<void>((resolve) => {
//                 setTimeout(resolve, 1000);
//             });

//             setUsers([...users, { ...duplicatedUser, id: (users.length + 1).toString() }]);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleSave = useCallback(async (): Promise<void> => {
//         if (!tableState?.save) return;
//         setIsSaving(true);
//         try {
//             await tableState.save();
//             // eslint-disable-next-line no-console
//             console.log('Table saved. Updated data:', tableState.tableData);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [tableState]);

//     return (
//         <Box sx={componentContainerStyles}>
//             {/* Custom toolbar — driven by onStateChange */}
//             <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mb: 1 }}>
//                 <Tooltip title="Undo (Ctrl+Z)">
//                     <span>
//                         <IconButton size="small" onClick={tableState?.undo} disabled={!tableState?.canUndo}>
//                             <UndoIcon fontSize="small" />
//                         </IconButton>
//                     </span>
//                 </Tooltip>
//                 <Tooltip title="Redo (Ctrl+Shift+Z)">
//                     <span>
//                         <IconButton size="small" onClick={tableState?.redo} disabled={!tableState?.canRedo}>
//                             <RedoIcon fontSize="small" />
//                         </IconButton>
//                     </span>
//                 </Tooltip>
//                 {tableState?.hasPendingChanges && (
//                     <>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             size="small"
//                             onClick={(): void => {
//                                 void handleSave();
//                             }}
//                             disabled={isSaving || !!tableState?.hasValidationErrors}
//                             sx={{ textTransform: 'none' }}
//                         >
//                             Save Changes
//                         </Button>
//                         <Button
//                             variant="outlined"
//                             color="error"
//                             size="small"
//                             onClick={(): void => {
//                                 tableState.reset();
//                             }}
//                             disabled={isSaving}
//                             sx={{ textTransform: 'none' }}
//                         >
//                             Reset
//                         </Button>
//                         <Typography variant="caption" color="text.secondary">
//                             You have unsaved changes
//                         </Typography>
//                     </>
//                 )}
//             </Box>
//             <EditableTable
//                 columns={columns}
//                 data={users}
//                 onCreate={handleCreate}
//                 onUpdate={handleUpdate}
//                 onDelete={handleDelete}
//                 onDuplicate={handleDuplicate}
//                 onValidate={validateUser}
//                 isLoading={isLoading}
//                 isSaving={isSaving}
//                 enableCreate={true}
//                 enableEdit={true}
//                 enableDelete={true}
//                 enableDuplicate={true}
//                 enableColumnPinning={true}
//                 enableRowActions={true}
//                 enableCellActions={true}
//                 enableClickToCopy="context-menu"
//                 createDisplayMode="row"
//                 editDisplayMode="cell"
//                 createButtonText="Add New User"
//                 enableUndoRedo={true}
//                 onStateChange={setTableState}
//                 deleteConfirmMessage={(row: User) =>
//                     `Are you sure you want to delete ${row.firstName} ${row.lastName}?`
//                 }
//                 minHeight="500px"
//             />
//         </Box>
//     );
// };
