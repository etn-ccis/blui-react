import { createContext, useContext } from 'react';
import { EditableTableData } from './types';

type EditableTableContextType<TData extends EditableTableData> = {
    /** Whether the table is in loading state */
    isLoading?: boolean;

    /** Whether the table is in saving state */
    isSaving?: boolean;

    /** Current validation errors */
    validationErrors?: Partial<Record<keyof TData, string | undefined>>;

    /** Edited rows that haven't been saved */
    editedRows?: Record<string, TData>;

    /** Function to validate a row */
    onValidate?: (row: TData) => Record<keyof TData, string | undefined>;
};

export const EditableTableContext = createContext<EditableTableContextType<any>>({
    isLoading: false,
    isSaving: false,
    validationErrors: {},
    editedRows: {},
});

export const useEditableTableContext = <TData extends EditableTableData>(): EditableTableContextType<TData> =>
    useContext(EditableTableContext);
