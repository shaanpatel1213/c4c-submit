
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../src/components/Dashboard';

describe('Dashboard Component', () => {
    beforeEach(() => {
        // Mock fetch requests
        (global.fetch as jest.Mock) = jest.fn((url: string, options?: RequestInit) => {
            if (url === 'http://localhost:4000/partners') {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                });
            }
            if (options?.method === 'POST') {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                });
            }
            if (options?.method === 'DELETE') {
                return Promise.resolve({});
            }
            if (options?.method === 'PUT') {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                });
            }
            return Promise.reject(new Error('Unhandled request'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders the Dashboard component', async () => {
        render(<Dashboard />);
        await waitFor(() => screen.getByText(/Add Partner/i));
        expect(screen.getByText(/Add Partner/i)).toBeInTheDocument();
    });

    test('adds a new partner', async () => {
        render(<Dashboard />);
        await waitFor(() => screen.getByText(/Add Partner/i));

        fireEvent.change(screen.getByPlaceholderText(/Name/i), {
            target: { value: 'New Partner' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Logo URL/i), {
            target: { value: 'http://example.com/logo.png' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Description/i), {
            target: { value: 'This is a new partner.' },
        });
        fireEvent.click(screen.getByLabelText(/Active/i));
        fireEvent.click(screen.getByText(/Add Partner/i));

        await waitFor(() => screen.getByText(/New Partner/i));
        expect(screen.getByText(/New Partner/i)).toBeInTheDocument();
    });

    test('deletes a partner', async () => {
        // Initial render with a partner
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    '1': {
                        name: 'Existing Partner',
                        thumbnailUrl: 'http://example.com/logo.png',
                        description: 'This is an existing partner.',
                        active: true,
                    },
                }),
            })
        );

        render(<Dashboard />);
        await waitFor(() => screen.getByText(/Existing Partner/i));

        fireEvent.click(screen.getByText(/Delete/i));

        await waitFor(() => expect(screen.queryByText(/Existing Partner/i)).not.toBeInTheDocument());
    });

    test('edits a partner', async () => {
        // Initial render with a partner
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    '1': {
                        name: 'Existing Partner',
                        thumbnailUrl: 'http://example.com/logo.png',
                        description: 'This is an existing partner.',
                        active: true,
                    },
                }),
            })
        );

        render(<Dashboard />);
        await waitFor(() => screen.getByText(/Existing Partner/i));

        fireEvent.click(screen.getByText(/Edit/i));

        fireEvent.change(screen.getByPlaceholderText(/Name/i), {
            target: { value: 'Edited Partner' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Logo URL/i), {
            target: { value: 'http://example.com/edited-logo.png' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Description/i), {
            target: { value: 'This is an edited partner.' },
        });
        fireEvent.click(screen.getByLabelText(/Active/i));
        fireEvent.click(screen.getByText(/Save Changes/i));

        await waitFor(() => screen.getByText(/Edited Partner/i));
        expect(screen.getByText(/Edited Partner/i)).toBeInTheDocument();
    });
});
