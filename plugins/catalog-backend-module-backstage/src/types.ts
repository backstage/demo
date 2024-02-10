export type GithubRepository = {
  id: string;
  name: string;
  description: string;
  default_branch: string;
  language: string;
  archived: boolean;
};

export type PackageJson = {
  name: string;
  version: string;
  backstage?: {
    role: string;
  };
  dependencies?: Record<string, string>;
};
