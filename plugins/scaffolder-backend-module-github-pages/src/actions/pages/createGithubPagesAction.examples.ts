import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description:
      'Enables GitHub Pages for a repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:pages',
          id: 'github-pages',
          name: 'Enable GitHub Pages',
          input: {
            repoUrl: 'github.com?repo=repository&owner=owner',
            buildType: 'workflow',
            sourceBranch: 'main',
            sourcePath: '/',
            token: 'gph_YourGitHubToken',
          },
        },
      ],
    }),
  },
];
