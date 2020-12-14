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

import os from 'os';
import path from 'path';
import parseGitUrl from 'git-url-parse';
import NodeGit, { Clone, Repository } from 'nodegit';
import fs from 'fs-extra';
import { getDefaultBranch } from './default-branch';
import { getGitRepoType, getTokenForGitRepo } from './git-auth';
import { Entity } from '@backstage/catalog-model';
import { InputError, UrlReader } from '@backstage/backend-common';
import { RemoteProtocol } from './stages/prepare/types';
import { Logger } from 'winston';

// Enables core.longpaths on windows to prevent crashing when checking out repos with long foldernames and/or deep nesting
// @ts-ignore
NodeGit.Libgit2.opts(28, 1);

export type ParsedLocationAnnotation = {
  type: RemoteProtocol;
  target: string;
};

export const parseReferenceAnnotation = (
  annotationName: string,
  entity: Entity,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[annotationName];

  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  // split on the first colon for the protocol and the rest after the first split
  // is the location.
  const [type, target] = annotation.split(/:(.+)/) as [
    RemoteProtocol?,
    string?,
  ];

  if (!type || !target) {
    throw new InputError(
      `Failure to parse either protocol or location for entity: ${entity.metadata.name}`,
    );
  }

  return {
    type,
    target,
  };
};

export const getLocationForEntity = (
  entity: Entity,
): ParsedLocationAnnotation => {
  const { type, target } = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  switch (type) {
    case 'github':
    case 'gitlab':
    case 'azure/api':
    case 'url':
      return { type, target };
    case 'dir':
      if (path.isAbsolute(target)) return { type, target };

      return parseReferenceAnnotation(
        'backstage.io/managed-by-location',
        entity,
      );
    default:
      throw new Error(`Invalid reference annotation ${type}`);
  }
};

export const getGitRepositoryTempFolder = async (
  repositoryUrl: string,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repositoryUrl);
  // removes .git from git location path
  parsedGitLocation.git_suffix = false;

  if (!parsedGitLocation.ref) {
    parsedGitLocation.ref = await getDefaultBranch(
      parsedGitLocation.toString('https'),
    );
  }

  return path.join(
    // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
    fs.realpathSync(os.tmpdir()),
    'backstage-repo',
    parsedGitLocation.source,
    parsedGitLocation.owner,
    parsedGitLocation.name,
    parsedGitLocation.ref,
  );
};

export const checkoutGitRepository = async (
  repoUrl: string,
  logger: Logger,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repoUrl);
  const repositoryTmpPath = await getGitRepositoryTempFolder(repoUrl);
  const token = await getTokenForGitRepo(repoUrl);

  if (fs.existsSync(repositoryTmpPath)) {
    try {
      const repository = await Repository.open(repositoryTmpPath);
      const currentBranchName = (
        await repository.getCurrentBranch()
      ).shorthand();
      await repository.fetch('origin');
      await repository.mergeBranches(
        currentBranchName,
        `origin/${currentBranchName}`,
      );
      return repositoryTmpPath;
    } catch (e) {
      logger.info(
        `Found error "${e.message}" in cached repository "${repoUrl}" when getting latest changes. Removing cached repository.`,
      );
      fs.removeSync(repositoryTmpPath);
    }
  }

  if (token) {
    const type = getGitRepoType(repoUrl);
    switch (type) {
      case 'gitlab':
        // Personal Access Token
        parsedGitLocation.token = `dummyUsername:${token}`;
        parsedGitLocation.git_suffix = true;
        break;
      case 'github':
        parsedGitLocation.token = `${token}:x-oauth-basic`;
        break;
      default:
        parsedGitLocation.token = `:${token}`;
    }
  }

  const repositoryCheckoutUrl = parsedGitLocation.toString('https');

  fs.mkdirSync(repositoryTmpPath, { recursive: true });
  await Clone.clone(repositoryCheckoutUrl, repositoryTmpPath);

  return repositoryTmpPath;
};

export const getLastCommitTimestamp = async (
  repositoryUrl: string,
  logger: Logger,
): Promise<number> => {
  const repositoryLocation = await checkoutGitRepository(repositoryUrl, logger);

  const repository = await Repository.open(repositoryLocation);
  const commit = await repository.getReferenceCommit('HEAD');

  return commit.date().getTime();
};

export const getDocFilesFromRepository = async (
  reader: UrlReader,
  entity: Entity,
): Promise<any> => {
  const { target } = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  const response = await reader.readTree(target);

  return await response.dir();
};
