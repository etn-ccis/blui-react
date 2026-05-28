import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileDragUpload } from './FileDragUpload';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

const createDataTransfer = (
    types: string[] = ['Files'],
    items: Array<{ kind: string; type: string }> = []
): DataTransfer =>
    ({
        types,
        items: items.map((item) => ({ ...item })),
        files: [] as unknown as FileList,
        dropEffect: 'none',
        effectAllowed: 'all',
    }) as unknown as DataTransfer;

describe('FileDragUpload', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
    });

    it('renders root element with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-file-drag-upload-root')).toBeTruthy();
    });

    it('renders dropzone element with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-file-drag-upload-dropzone')).toBeTruthy();
    });

    it('renders hidden file input with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-file-drag-upload-input')).toBeTruthy();
    });

    it('renders default title text', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByText('Upload a File')).toBeTruthy();
    });

    it('renders default subtitle text', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByText('Use upload button or drag files here')).toBeTruthy();
    });

    it('renders upload button', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        expect(screen.getByText('Upload')).toBeTruthy();
    });

    it('renders with custom title', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload title="Upload a Photo" />
            </ThemeProvider>
        );
        expect(screen.getByText('Upload a Photo')).toBeTruthy();
    });

    it('renders with custom description', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload description="Max 5 MB" />
            </ThemeProvider>
        );
        expect(screen.getByText('Max 5 MB')).toBeTruthy();
    });

    it('renders compact variant', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload compact />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-file-drag-upload-dropzone')).toBeTruthy();
    });

    it('renders with custom button', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload customButton={<button>Custom</button>} />
            </ThemeProvider>
        );
        expect(screen.getByText('Custom')).toBeTruthy();
    });

    it('sets multiple attribute on input when multiple is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload multiple />
            </ThemeProvider>
        );
        const input = screen.getByTestId('blui-file-drag-upload-input');
        expect(input).toHaveAttribute('multiple');
    });

    it('sets accept attribute on input', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload accept="image/png,image/jpeg" />
            </ThemeProvider>
        );
        const input = screen.getByTestId('blui-file-drag-upload-input');
        expect(input).toHaveAttribute('accept', 'image/png,image/jpeg');
    });

    it('calls onFilesSelected when files are selected via input', () => {
        const handleFiles = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload onFilesSelected={handleFiles} />
            </ThemeProvider>
        );
        const input = screen.getByTestId('blui-file-drag-upload-input');
        const file = new File(['content'], 'test.png', { type: 'image/png' });
        Object.defineProperty(input, 'files', { value: [file], writable: false });
        fireEvent.change(input);
        expect(handleFiles).toHaveBeenCalledTimes(1);
    });

    it('accepts custom className', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload className="my-custom-class" />
            </ThemeProvider>
        );
        const root = screen.getByTestId('blui-file-drag-upload-root');
        expect(root.className).toContain('my-custom-class');
    });

    it('renders with ReactNode title', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload title={<span data-testid="custom-title">Custom Title</span>} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-title')).toBeTruthy();
    });

    it('renders with ReactNode description', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload description={<span data-testid="custom-desc">Custom Desc</span>} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-desc')).toBeTruthy();
    });

    it('handles drag enter on dropzone', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        const dropzone = screen.getByTestId('blui-file-drag-upload-dropzone');
        const dt = createDataTransfer(['Files'], [{ kind: 'file', type: 'image/png' }]);
        fireEvent.dragEnter(dropzone, { dataTransfer: dt });
        // Should not throw
        expect(dropzone).toBeTruthy();
    });

    it('handles drag leave on dropzone', () => {
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload />
            </ThemeProvider>
        );
        const dropzone = screen.getByTestId('blui-file-drag-upload-dropzone');
        fireEvent.dragLeave(dropzone);
        expect(dropzone).toBeTruthy();
    });

    it('handles drop on dropzone', () => {
        const handleFiles = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <FileDragUpload onFilesSelected={handleFiles} />
            </ThemeProvider>
        );
        const dropzone = screen.getByTestId('blui-file-drag-upload-dropzone');
        const file = new File(['content'], 'test.png', { type: 'image/png' });
        const dt = {
            types: ['Files'],
            items: [{ kind: 'file', type: 'image/png' }],
            files: [file] as unknown as FileList,
            dropEffect: 'none',
            effectAllowed: 'all',
        } as unknown as DataTransfer;
        Object.defineProperty(dt.files, 'length', { value: 1 });
        fireEvent.drop(dropzone, { dataTransfer: dt });
        expect(handleFiles).toHaveBeenCalledTimes(1);
    });
});
