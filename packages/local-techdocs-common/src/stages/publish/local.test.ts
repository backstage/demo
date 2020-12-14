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

/* eslint-disable no-restricted-syntax */
import fs from 'fs-extra';
import path from 'path';
import {
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { LocalPublish } from './local';

jest.mock('fs-extra', () => {
  const fsOriginal = jest.requireActual('fs-extra');
  return {
    ...fsOriginal,
    access: jest.fn().mockImplementation((path, checkType, callback) => {
      if (
        path.includes('http://localhost:7000/static') &&
        checkType === fs.constants.F_OK
      ) {
        callback();
      } else {
        callback(new Error());
      }
    }),
  };
});

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

describe('local publisher', () => {
  it('should publish generated documentation dir', async () => {
    const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
      getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000'),
      getExternalBaseUrl: jest.fn(),
    };

    const mockConfig = ConfigReader.fromConfigs([
      {
        context: '',
        data: {
          techdocs: {
            requestUrl: 'http://localhost:7000',
            storageUrl: 'http://localhost:7000/static/docs',
          },
        },
      },
    ]);

    const publisher = new LocalPublish(mockConfig, logger, testDiscovery);
    const mockEntity = createMockEntity();
    const tempDir = fs.mkdtempSync(`${__dirname}/test-component-folder-`);
    expect(tempDir).toBeTruthy();

    fs.closeSync(fs.openSync(path.join(tempDir, '/mock-file'), 'w'));
    await publisher.publish({ entity: mockEntity, directory: tempDir });

    const publishDir = path.resolve(
      __dirname,
      `../../../../../plugins/techdocs-backend/static/docs/${mockEntity.metadata.name}`,
    );
    const resultDir = path.resolve(
      __dirname,
      `../../../../../plugins/techdocs-backend/static/docs/default/${mockEntity.kind}/${mockEntity.metadata.name}`,
    );

    expect(fs.existsSync(resultDir)).toBeTruthy();
    expect(fs.existsSync(path.join(resultDir, '/mock-file'))).toBeTruthy();

    expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

    fs.removeSync(publishDir);
    fs.removeSync(tempDir);
  });
});
