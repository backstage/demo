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

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Content, Page, useApi } from '@backstage/core';
import { Reader } from './Reader';
import { useAsync } from 'react-use';
import { TechDocsPageHeader } from './TechDocsPageHeader';
import { techdocsApiRef } from '../../api';

export const TechDocsPage = () => {
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const { namespace, kind, name } = useParams();

  const techdocsApi = useApi(techdocsApiRef);

  const techdocsMetadataRequest = useAsync(() => {
    if (documentReady) {
      return techdocsApi.getTechDocsMetadata({ kind, namespace, name });
    }

    return Promise.resolve({ loading: true });
  }, [kind, namespace, name, techdocsApi, documentReady]);

  const entityMetadataRequest = useAsync(() => {
    return techdocsApi.getEntityMetadata({ kind, namespace, name });
  }, [kind, namespace, name, techdocsApi]);

  const onReady = () => {
    setDocumentReady(true);
  };

  return (
    <Page themeId="documentation">
      <TechDocsPageHeader
        metadataRequest={{
          techdocs: techdocsMetadataRequest,
          entity: entityMetadataRequest,
        }}
        entityId={{
          kind,
          namespace,
          name,
        }}
      />
      <Content data-testid="techdocs-content">
        <Reader
          onReady={onReady}
          entityId={{
            kind,
            namespace,
            name,
          }}
        />
      </Content>
    </Page>
  );
};
