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
import express from 'express';
import {
  Storage,
  UploadResponse,
  FileExistsResponse,
} from '@google-cloud/storage';
import { Logger } from 'winston';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { getHeadersForFileExtension, getFileTreeRecursively } from './helpers';
import { PublisherBase, PublishRequest } from './types';

export class GoogleGCSPublish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let credentials = '';
    let projectId = '';
    let bucketName = '';
    try {
      credentials = config.getString(
        'techdocs.publisher.googleGcs.credentials',
      );
      projectId = config.getString('techdocs.publisher.googleGcs.projectId');
      bucketName = config.getString('techdocs.publisher.googleGcs.bucketName');
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'googleGcs' in your app config, " +
          'credentials, projectId and bucketName are required in techdocs.publisher.googleGcs ' +
          'required to authenticate with Google Cloud Storage.',
      );
    }

    let credentialsJson = {};
    try {
      credentialsJson = JSON.parse(credentials);
    } catch (err) {
      throw new Error(
        'Error in parsing techdocs.publisher.googleGcs.credentials config to JSON.',
      );
    }

    const storageClient = new Storage({
      credentials: credentialsJson,
      projectId: projectId,
    });

    // Check if the defined bucket exists. Being able to connect means the configuration is good
    // and the storage client will work.
    storageClient
      .bucket(bucketName)
      .getMetadata()
      .then(() => {
        logger.info(
          `Successfully connected to the GCS bucket ${bucketName} in the GCP project ${projectId}.`,
        );
      })
      .catch(reason => {
        logger.error(
          `Could not retrieve metadata about the GCS bucket ${bucketName} in the GCP project ${projectId}. ` +
            'Make sure the GCP project and the bucket exists and the access key located at the path ' +
            "techdocs.publisher.googleGcs.credentials defined in app config has the role 'Storage Object Creator'. " +
            'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
        );
        throw new Error(`from GCS client library: ${reason.message}`);
      });

    return new GoogleGCSPublish(storageClient, bucketName, logger);
  }

  constructor(
    private readonly storageClient: Storage,
    private readonly bucketName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.bucketName = bucketName;
    this.logger = logger;
  }

  /**
   * Upload all the files from the generated `directory` to the GCS bucket.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  publish({ entity, directory }: PublishRequest): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Note: GCS manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      const uploadPromises: Array<Promise<UploadResponse>> = [];
      allFilesToUpload.forEach(filePath => {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = filePath.replace(`${directory}/`, '');
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePath}`; // GCS Bucket file relative path
        // TODO: Upload in chunks of ~10 files instead of all files at once.
        uploadPromises.push(
          this.storageClient.bucket(this.bucketName).upload(filePath, {
            destination,
          }),
        );
      });

      Promise.all(uploadPromises)
        .then(() => {
          this.logger.info(
            `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
          );
          resolve(undefined);
        })
        .catch((err: Error) => {
          const errorMessage = `Unable to upload file(s) to Google Cloud Storage. Error ${err.message}`;
          this.logger.error(errorMessage);
          reject(errorMessage);
        });
    });
  }

  fetchTechDocsMetadata(entityName: EntityName): Promise<string> {
    return new Promise((resolve, reject) => {
      const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .bucket(this.bucketName)
        .file(`${entityRootDir}/techdocs_metadata.json`)
        .createReadStream()
        .on('error', err => {
          this.logger.error(err.message);
          reject(err.message);
        })
        .on('data', chunk => {
          fileStreamChunks.push(chunk);
        })
        .on('end', () => {
          const techdocsMetadataJson = Buffer.concat(
            fileStreamChunks,
          ).toString();
          resolve(techdocsMetadataJson);
        });
    });
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return (req, res) => {
      // Trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html
      const filePath = req.path.replace(/^\//, '');

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = filePath.split('.')[filePath.split('.').length - 1];
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .bucket(this.bucketName)
        .file(filePath)
        .createReadStream()
        .on('error', err => {
          this.logger.warn(err.message);
          res.status(404).send(err.message);
        })
        .on('data', chunk => {
          fileStreamChunks.push(chunk);
        })
        .on('end', () => {
          const fileContent = Buffer.concat(fileStreamChunks).toString();
          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }

          res.send(fileContent);
        });
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    return new Promise(resolve => {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
      this.storageClient
        .bucket(this.bucketName)
        .file(`${entityRootDir}/index.html`)
        .exists()
        .then((response: FileExistsResponse) => {
          resolve(response[0]);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
