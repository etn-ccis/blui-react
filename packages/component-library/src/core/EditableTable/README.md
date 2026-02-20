# Editable Table Component

An editable table that lets you create, edit, and manage data with built-in validation, undo/redo, and real-time updates. Think of it as a smart spreadsheet for your app.


## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Main Components](#main-components)

---

## Installation

Copy the `EditableTable` folder into your project and install dependencies:

```bash
npm install \
  react react-dom \
  react-hook-form @hookform/resolvers/zod zod \
  @mui/material @mui/icons-material @emotion/react @emotion/styled \
  material-react-table \
  @brightlayer-ui/react-components @brightlayer-ui/colors @brightlayer-ui/themes \
  chart.js react-chartjs-2
```

---

## Quick Start

### Step 1: Define Your Data Schema

Tell the table what kind of data you're working with using a schema (think of it as a blueprint):

```tsx
import { z } from 'zod';

const MyDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  attributes: z.object({
    type: z.enum(['sensor', 'actuator']),
    channel: z.number().min(0).max(15),
    enabled: z.boolean(),
  }),
});
```

### Step 2: Use the Table in Your App

```tsx
import { EditableTable } from './components/EditableTable/EditableTable';
import { DataPointCommandDialogProvider } from './components/EditableTable/contexts/DataPointCommandDialogContext';

function MyApp() {
  const myData = [
    {
      name: 'Temperature Sensor',
      description: 'Main temperature sensor',
      attributes: { type: 'sensor', channel: 0, enabled: true },
    },
  ];

  return (
    <DataPointCommandDialogProvider>
      <EditableTable deviceResources={myData} />
    </DataPointCommandDialogProvider>
  );
}
```

---

## How It Works

The table is made up of several smaller pieces that work together:

**EditableTable** - The main component that puts everything together
- Handles your data
- Manages tabs (if you have different types of data)
- Tracks what's been changed
- Provides undo/redo functionality

**TopToolbar** - The controls at the top
- Tabs to switch between data types
- Search bar to find specific items
- Buttons to show/hide columns

**Edit Cells** - The individual table cells you can click and edit
- Automatically validates what you type
- Shows errors if something's wrong
- Marks changed cells with a badge

**Row Actions** - Buttons on each row
- Duplicate a row
- Delete a row
- Send commands (for device control)

---

## Folder Structure

```
EditableTable/
├── EditableTable.tsx                # Main table - start here!
├── DeviceDetailsDataPoints.tsx      # Wrapper for device profiles
│
├── Toolbars
│   ├── TopToolbar.tsx               # Header with tabs and search
│   ├── BottomToolbar.tsx            # "Add Row" button
│   └── EmptyRowsFallback.tsx        # What shows when table is empty
│
├── Cells (the editable parts)
│   ├── AttributeEditCell.tsx        # Cells you can edit
│   └── RealtimeValueCell.tsx        # Cells showing live data
│
├── Actions
│   ├── RowActions.tsx               # Buttons on each row
│   └── DataPointCommandDialog.tsx   # Popup for sending commands
│
├── hooks/ (reusable logic)
│   ├── useDataPointsForm.tsx        # Manages form data
│   ├── useFormHistory.tsx           # Handles undo/redo
│   └── useTableConfig.tsx           # Table settings
│
└── contexts/ (shared state)
    └── RecordChangeContext.tsx      # Tracks what changed
```

---

## Main Components

### EditableTable (The Main Component)

This is the heart of the component. You pass it your data and it handles everything:

```tsx
<EditableTable 
  deviceResources={myData}
  onFormStateReady={(state) => {
    // Now you can access form state, like checking if there are unsaved changes
    console.log('Has changes?', state.isDirty);
  }}
/>
```

**What it does:**
- Creates tabs for different data types
- Lets you edit cells directly
- Validates your input automatically
- Tracks what you've changed
- Provides undo/redo (Cmd+Z works!)

---

### **AttributeEditCell** (the editable cells)

Each cell in the table uses this component. It knows what kind of data it should accept:

- Text fields for names and descriptions
- Number fields for numeric values
- Checkboxes for yes/no options
- Dropdowns for predefined choices
AttributeEditCell (Editable C
**Features:**
- Shows validation errors
- Marks changed cells with a badge
- Auto-selects text when you click to edit

---

### useDataPointsForm Hook (Form Management)

This is the "brain" that manages all your data. It gives you methods to work with the form:

```tsx
const {
  isDirty,      // True if anything changed
  isValid,      // True if all data is valid
  getValues,    // Get all current data
  reset,        // Mark everything as saved
  undo,         // Undo last change
  redo,         // Redo last undo
  canUndo,      // Can you undo?
  canRedo,      // Can you redo?
} = useDataPointsForm();
```

---

## Common Use Cases

### Basic Usage with Save Button

```tsx
import { useState } from 'react';
import { Button } from '@mui/material';

function MyEditor() {
  const [formState, setFormState] = useState(null);

  const handleSave = async () => {
    const data = formState.getValues();
    await saveToBackend(data);
    formState.reset(data); // Marks everything as saved
  };

  return (
    <div>
      <Button 
        onClick={handleSave} 
        disabled={!formState?.isDirty}
      >
        Save Changes
      </Button>
      <EditableTable 
        deviceResources={myData}
        onFormStateReady={setFormState}
      />
    </div>
  );
}
```

### With Undo/Redo Buttons

```tsx
function MyEditor() {
  const [formState, setFormState] = useState(null);

  return (
    <>
      <Button onClick={() => formState?.undo()} disabled={!formState?.canUndo}>
        Undo
      </Button>
      <Button onClick={() => formState?.redo()} disabled={!formState?.canRedo}>
        Redo
      </Button>
      <EditableTable 
        deviceResources={myData}
        onFormStateReady={setFormState}
      />
    </>
  );
}
```

---

## Troubleshooting

### Validation Errors Not Showing
- Make sure your Zod schema is properly defined
- Check that field names match your data structure
- Validation happens when you leave a field (onBlur)

### Undo/Redo Not Working
- Press Cmd+Z (Mac) or Ctrl+Z (Windows)
- Changes are recorded when you finish editing a cell
- Make sure you're not in the middle of editing

### Data Not Saving
- Check that `onFormStateReady` callback is set up correctly
- Call `formState.reset()` after saving to clear the dirty state
- Check browser console for errors

---

## Key Takeaways

1. **Copy the folder** → Install dependencies → Use the component
2. **Define your data rules** with Zod schemas
3. **Use `onFormStateReady`** to get access to form state (saving, undo, etc.)
4. **Everything is automatic** - validation, change tracking, UI updates
5. **Cmd+Z works** out of the box for undo/redo

That's it! The table handles the complexity so you don't have to. 🎉