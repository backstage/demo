import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import App from './App';

describe('App', () => {
  
  const mockRandomUUID = () =>
    '068f3129-7440-4e0e-8fd4-xxxxxxxxxxxx'.replace(
      /x/g,
      () => Math.floor(Math.random() * 16).toString(16), // 0x0 to 0xf
    ) as `${string}-${string}-${string}-${string}-${string}`;
  
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

    const rendered = await renderWithEffects(<App />);
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
