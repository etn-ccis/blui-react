# DataTable Cell Components

This directory contains the cell components used by DataTable for rendering and editing different data types.

## Cell Types

The DataTable supports 4 cell types, specified via the `cellType` property in column definitions:

### 1. **Text** (Default)
- Display: `TextNumberCell` - left-aligned text
- Edit: `SimpleTextInput` - native HTML text input
- Usage: `{ accessorKey: 'name', header: 'Name', cellType: 'text' }`

### 2. **Number**
- Display: `TextNumberCell` - right-aligned number
- Edit: `SimpleTextInput` - native HTML number input  
- Usage: `{ accessorKey: 'age', header: 'Age', cellType: 'number' }`

### 3. **Select** (Dropdown)
- Display: `SelectCell` - displays selected value
- Edit: `SimpleSelectInput` - MUI Autocomplete with filtering
- Usage: 
  ```tsx
  { 
    accessorKey: 'state', 
    header: 'State', 
    cellType: 'select',
    editSelectOptions: ['CA', 'NY', 'TX']
  }
  ```

### 4. **Binary** (Boolean)
- Display: `BinaryCell` - checkbox + text (0/1)
- Edit: `SimpleBinaryInput` - clickable checkbox + editable text
- Usage: `{ accessorKey: 'isActive', header: 'Active', cellType: 'binary' }`

## Architecture

Each cell type has two components:

**Display Components** (shown when not editing):
- `TextNumberCell.tsx` - For text and number display
- `SelectCell.tsx` - For dropdown display
- `BinaryCell.tsx` - For boolean display

**Edit Components** (shown when editing):
- `SimpleTextInput.tsx` - For text/number editing
- `SimpleSelectInput.tsx` - For dropdown editing with filtering
- `SimpleBinaryInput.tsx` - For boolean editing

## How It Works

1. User defines columns with explicit `cellType`:
   ```tsx
   const columns = [
     { accessorKey: 'name', header: 'Name', cellType: 'text' },
     { accessorKey: 'age', header: 'Age', cellType: 'number' },
   ];
   ```

2. `useEnhancedColumns` hook reads `cellType` and renders appropriate components:
   - If no `cellType` is specified, defaults to `'text'`
   - Maps `cellType` to display and edit components

3. Single-click switches between display and edit components

## Features

- **Single-click editing**: Click once to enter edit mode
- **Validation**: Error states with red outline and background
- **Edited indicator**: Blue dot shows modified cells
- **Cursor states**: 
  - `cell` cursor when not editing
  - `pointer` cursor when editing
- **Auto-save**: Changes save on blur
