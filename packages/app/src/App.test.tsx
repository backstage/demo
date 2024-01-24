import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';
import { v4 } from 'uuid';

describe('App', () => {
  const mockRandomUUID = () =>
    v4() as `${string}-${string}-${string}-${string}-${string}`;

  beforeEach(() => {
    window.crypto.randomUUID = mockRandomUUID;
  });

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
            lighthouse: {
              baseUrl: 'http://localhost:3003',
            },
            techdocs: {
              storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
            },
          },
          context: 'test',
        },
      ] as any,
    };

    const rendered = render(<App />);
    await waitFor(() => {
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });
});
