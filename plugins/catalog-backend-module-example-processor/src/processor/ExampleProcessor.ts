import { ComponentEntity, Entity } from '@backstage/catalog-model';

import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';

export class ExampleProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'ExampleProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    if (location.type !== 'url') {
      return entity;
    }

    if (entity.metadata.name === 'backstage') {
      return entity;
    }

    const managedByLocation =
      entity.metadata.annotations?.['backstage.io/managed-by-origin-location'];
    if (
      managedByLocation &&
      (managedByLocation ===
        'url:https://github.com/backstage/community-plugins/blob/main/**/catalog-info.yaml' ||
        managedByLocation ===
          'url:https://github.com/backstage/backstage/blob/master/**/catalog-info.yaml')
    ) {
      const component = entity as ComponentEntity;
      component.spec.lifecycle = 'example';
    }

    return entity;
  }
}
