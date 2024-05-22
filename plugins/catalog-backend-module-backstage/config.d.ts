import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * BackstageEntityProvider configuration
       */
      backstage?: {
        /**
         * Flag to enable or disable the provider
         */
        enabled: boolean;
        /**
         * TaskScheduleDefinition for the refresh.
         */
        schedule: SchedulerServiceTaskScheduleDefinitionConfig;
      };
    };
  };
}
