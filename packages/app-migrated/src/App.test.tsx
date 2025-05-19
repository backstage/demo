import { render, waitFor } from '@testing-library/react';
import app from './App';
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
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7007' },
            techdocs: {
              storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
            },
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
