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

import { getVoidLogger } from '@backstage/backend-common';
import { CommonGitPreparer } from './commonGit';
import { checkoutGitRepository } from '../../helpers';

function normalizePath(path: string) {
  return path
    .replace(/^[a-z]:/i, '')
    .split('\\')
    .join('/');
}

jest.mock('../../helpers', () => ({
  ...jest.requireActual<{}>('../../helpers'),
  checkoutGitRepository: jest.fn(() => '/tmp/backstage-repo/org/name/branch'),
}));

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

const logger = getVoidLogger();

describe('commonGit preparer', () => {
  it('should prepare temp docs path from github repo', async () => {
    const preparer = new CommonGitPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'github:https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
    });

    const tempDocsPath = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(1);
    expect(normalizePath(tempDocsPath)).toEqual(
      '/tmp/backstage-repo/org/name/branch/plugins/techdocs-backend/examples/documented-component',
    );
  });

  it('should prepare temp docs path from gitlab repo', async () => {
    const preparer = new CommonGitPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'gitlab:https://gitlab.com/xesjkeee/go-logger/blob/master/catalog-info.yaml',
    });

    const tempDocsPath = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(2);
    expect(normalizePath(tempDocsPath)).toEqual(
      '/tmp/backstage-repo/org/name/branch/catalog-info.yaml',
    );
  });

  it('should prepare temp docs path from azure repo', async () => {
    const preparer = new CommonGitPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'azure/api:https://dev.azure.com/backstage-org/backstage-project/_git/template-repo?path=%2Ftemplate.yaml',
    });

    const tempDocsPath = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(3);
    expect(normalizePath(tempDocsPath)).toEqual(
      '/tmp/backstage-repo/org/name/branch/template.yaml',
    );
  });
});
