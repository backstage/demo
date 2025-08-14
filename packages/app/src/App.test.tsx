import { render, waitFor } from '@testing-library/react';
import app from './App';

describe('App', () => {
  it('should render', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: {
              title: 'Test',
              support: { url: 'http://localhost:7007/support' },
            },
            backend: { baseUrl: 'http://localhost:7007' },
          },
          context: 'test',
        },
      ] as any,
    };

    const rendered = render(app);
    await waitFor(() => {
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });
});
