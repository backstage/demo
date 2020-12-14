/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApiProvider, ApiRegistry } from '@backstage/core-api';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog';
import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { TechDocsHome } from './TechDocsHome';

describe('TechDocs Home', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () => Promise.resolve({ items: [] }),
  };

  const apiRegistry = ApiRegistry.from([[catalogApiRef, catalogApi]]);

  it('should render a TechDocs home page', async () => {
    const { findByTestId, findByText } = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <TechDocsHome />
        </ApiProvider>,
      ),
    );

    // Header
    expect(await findByText('Documentation')).toBeInTheDocument();
    expect(
      await findByText(/Documentation available in Backstage/i),
    ).toBeInTheDocument();

    // Explore Content
    expect(await findByTestId('docs-explore')).toBeDefined();
  });
});
