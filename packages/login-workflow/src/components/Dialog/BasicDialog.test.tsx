import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BasicDialog, BasicDialogProps } from './BasicDialog';

const defaultProps: BasicDialogProps = {
    open: true,
    title: 'Test Title',
    body: 'Test body content',
    dismissButtonText: 'Close',
    onClose: jest.fn(),
};

describe('BasicDialog', () => {
    it('renders the dialog with title and body', () => {
        render(<BasicDialog {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test body content')).toBeInTheDocument();
    });

    it('renders the dismiss button with custom text', () => {
        render(<BasicDialog {...defaultProps} />);
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('calls onClose when dismiss button is clicked', () => {
        render(<BasicDialog {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('renders default dismiss button text if not provided', () => {
        render(<BasicDialog {...defaultProps} dismissButtonText={undefined} />);
        expect(screen.getByRole('button', { name: 'Okay' })).toBeInTheDocument();
    });

    it('does not render dialog when open is false', () => {
        render(<BasicDialog {...defaultProps} open={false} />);
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
});
