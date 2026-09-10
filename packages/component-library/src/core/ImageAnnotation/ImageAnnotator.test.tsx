import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageAnnotator } from './ImageAnnotator';

afterEach(cleanup);

describe('ImageAnnotator', () => {
    it('renders the root and image elements', () => {
        render(<ImageAnnotator src="image.jpg" />);

        expect(screen.getByTestId('blui-image-annotator-root')).toBeInTheDocument();
        expect(screen.getByTestId('blui-image-annotator-image')).toBeInTheDocument();
    });

    it('renders the image with the provided source and alt text', () => {
        render(<ImageAnnotator src="https://example.com/image.jpg" alt="A sample image" />);

        expect(screen.getByTestId('blui-image-annotator-image')).toHaveAttribute(
            'src',
            'https://example.com/image.jpg'
        );
        expect(screen.getByTestId('blui-image-annotator-image')).toHaveAttribute('alt', 'A sample image');
    });

    it('uses an empty string for alt text by default', () => {
        render(<ImageAnnotator src="image.jpg" />);

        expect(screen.getByTestId('blui-image-annotator-image')).toHaveAttribute('alt', '');
    });

    it('applies default dimensions to the root and image', () => {
        render(<ImageAnnotator src="image.jpg" />);

        expect(screen.getByTestId('blui-image-annotator-root')).toHaveStyle({ width: '100%', height: 'auto' });
        expect(screen.getByTestId('blui-image-annotator-image')).toHaveStyle({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        });
    });

    it('applies custom width and height to the root', () => {
        render(<ImageAnnotator src="image.jpg" width={320} height="240px" />);

        expect(screen.getByTestId('blui-image-annotator-root')).toHaveStyle({ width: '320px', height: '240px' });
    });

    it('renders children inside the root container', () => {
        render(
            <ImageAnnotator src="image.jpg">
                <button type="button">Details</button>
            </ImageAnnotator>
        );

        const root = screen.getByTestId('blui-image-annotator-root');
        const image = screen.getByTestId('blui-image-annotator-image');
        const child = screen.getByRole('button', { name: 'Details' });

        expect(child).toBeInTheDocument();
        expect(root).toContainElement(child);
        expect(image).toBeInTheDocument();
    });

    it('applies sx styles to the root', () => {
        render(<ImageAnnotator src="image.jpg" sx={{ backgroundColor: 'rgb(255, 0, 0)' }} />);

        expect(screen.getByTestId('blui-image-annotator-root')).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('applies custom classes to the root and image slots', () => {
        render(<ImageAnnotator src="image.jpg" classes={{ root: 'custom-root', image: 'custom-image' }} />);

        expect(screen.getByTestId('blui-image-annotator-root')).toHaveClass('custom-root');
        expect(screen.getByTestId('blui-image-annotator-image')).toHaveClass('custom-image');
    });

    it('forwards a ref to the root element', () => {
        const ref = React.createRef<HTMLDivElement>();

        render(<ImageAnnotator ref={ref} src="image.jpg" />);

        expect(ref.current).toBe(screen.getByTestId('blui-image-annotator-root'));
    });
});
