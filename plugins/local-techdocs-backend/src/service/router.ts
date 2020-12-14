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
import Router from 'express-promise-router';
import express from 'express';
import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import {
  PublisherBase,
  getLocationForEntity,
} from '@backstage/local-techdocs-common';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { getEntityNameFromUrlPath } from './helpers';

type RouterOptions = {
  publisher: PublisherBase;
  logger: Logger;
  discovery: PluginEndpointDiscovery;
  config: Config;
};

export async function createRouter({
  publisher,
  config,
  logger,
  discovery,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  router.get('/metadata/techdocs/*', async (req, res) => {
    // path is `:namespace/:kind:/:name`
    const { '0': path } = req.params;
    const entityName = getEntityNameFromUrlPath(path);

    publisher
      .fetchTechDocsMetadata(entityName)
      .then(techdocsMetadataJson => {
        res.send(techdocsMetadataJson);
      })
      .catch(reason => {
        res.status(500).send(`Unable to get Metadata. Reason: ${reason}`);
      });
  });

  router.get('/metadata/entity/:namespace/:kind/:name', async (req, res) => {
    const catalogUrl = await discovery.getBaseUrl('catalog');

    const { kind, namespace, name } = req.params;

    try {
      const entity = (await (
        await fetch(
          `${catalogUrl}/entities/by-name/${kind}/${namespace}/${name}`,
        )
      ).json()) as Entity;

      const locationMetadata = getLocationForEntity(entity);
      res.send({ ...entity, locationMetadata });
    } catch (err) {
      logger.info(
        `Unable to get metadata for ${kind}/${namespace}/${name} with error ${err}`,
      );
      throw new Error(
        `Unable to get metadata for ${kind}/${namespace}/${name} with error ${err}`,
      );
    }
  });

  router.get('/docs/:namespace/:kind/:name/*', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const storageUrl = config.getString('techdocs.storageUrl');

    const catalogUrl = await discovery.getBaseUrl('catalog');
    const triple = [kind, namespace, name].map(encodeURIComponent).join('/');

    const catalogRes = await fetch(`${catalogUrl}/entities/by-name/${triple}`);
    if (!catalogRes.ok) {
      const catalogResText = await catalogRes.text();
      res.status(catalogRes.status);
      res.send(catalogResText);
      return;
    }

    res.redirect(`${storageUrl}${req.path.replace('/docs', '')}`);
  });

  // Route middleware which serves files from the storage set in the publisher.
  router.use('/static/docs', publisher.docsRouter());

  return router;
}
