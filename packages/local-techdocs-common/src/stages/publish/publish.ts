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
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

import { PublisherType, PublisherBase } from './types';
import { LocalPublish } from './local';
import { GoogleGCSPublish } from './googleStorage';

/**
 * Factory class to create a TechDocs publisher based on defined publisher type in app config.
 * Uses `techdocs.publisher.type`.
 */
export class Publisher {
  static fromConfig(
    config: Config,
    logger: Logger,
    discovery: PluginEndpointDiscovery,
  ): PublisherBase {
    const publisherType = (config.getOptionalString(
      'techdocs.publisher.type',
    ) ?? 'local') as PublisherType;

    switch (publisherType) {
      case 'googleGcs':
        logger.info('Creating Google Storage Bucket publisher for TechDocs');
        return GoogleGCSPublish.fromConfig(config, logger);
      case 'local':
        logger.info('Creating Local publisher for TechDocs');
        return new LocalPublish(config, logger, discovery);
      default:
        logger.info('Creating Local publisher for TechDocs');
        return new LocalPublish(config, logger, discovery);
    }
  }
}
