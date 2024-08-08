# [Backstage Demo](https://demo.backstage.io)

[![Link to backstage-demo in Backstage Demo, Component: backstage-demo](https://demo.backstage.io/api/badges/entity/default/component/backstage-demo/badge/pingback 'Link to backstage-demo in Backstage Demo')](https://demo.backstage.io/catalog/default/component/backstage-demo) [![Entity docs badge, docs: backstage-demo](https://demo.backstage.io/api/badges/entity/default/component/backstage-demo/badge/docs 'Entity docs badge')](https://demo.backstage.io/catalog/default/component/backstage-demo/docs)

This repository is the source code for the demo [Backstage](https://backstage.io/) instance deployed to [demo.backstage.io](https://demo.backstage.io).

Instructions for building your own Backstage instance can be found at the [Getting Started](https://backstage.io/docs/getting-started/) portion of the docs.

## Reference Project

The sprit of this demo and repository is to showcase Backstage as closely as possible to what you would get from running `npx @backstage/create-app@latest` to create a new Backstage instance. There have been some additional changes beyond that starting point to help showcase some of Backstage's features more clearly. It also acts as a reference project for how to best keep it up to date and to show a working example of recent architecture patterns like the [new backend system](https://backstage.io/docs/backend-system/).

## Core Features

Here are the core features that come with Backstage and links to examples in the demo.

- [Software Catalog](https://demo.backstage.io/catalog)
- [Software Templates](https://demo.backstage.io/create)
- [Search](https://demo.backstage.io/search)
- [TechDocs](https://demo.backstage.io/docs)
- [Kubernetes plugin](https://demo.backstage.io/catalog/default/component/dice-roller)

> Note: the Kubernetes plugin does need to be installed but is considered a core feature

## Additional Plugins

The following plugins have been added to help better illustrate Backstage features and to highlight the ability to add plugins.

- Badges: See the badges at the top of this `README`
- [Cost Insights](https://demo.backstage.io/cost-insights)
- [Explore](https://demo.backstage.io/explore)
- [GitHub Actions](https://demo.backstage.io/catalog/default/component/backstage-demo/ci-cd)
- [GraphiQL](https://demo.backstage.io/graphiql)
- [Home](https://demo.backstage.io/home)
- [Tech Radar](https://demo.backstage.io/tech-radar)
- [To Do](https://demo.backstage.io/catalog/default/component/backstage-demo/todos)

### Alpha features

The following plugins are considered alpha and still under heavy development. They have been added to the Demo site to showcase them.

- [Notifications](https://demo.backstage.io/notifications)

## Code Customization

We have made some code customization as well. The following sections go into detail about them.

### Custom Theme

We have created a custom theme called Aperture to help showcase what some of the possibilities are that a custom theme can allow and to have a working example.

> Note: This theme is just an example and not intended to be copied as is.

To view this theme in the Demo:

1. Go to the [Settings area](https://demo.backstage.io/settings)
2. In the Appearance card for the Theme click on "APERTURE"
3. The theme will automatically change, now you can explore the Demo to see how this theme looks

The Aperture custom theme code can be found in the [`aperture.ts`](https://github.com/backstage/demo/blob/master/packages/app/src/theme/aperture.ts) file.

More details on creating a custom theme can be found in the [Creating a Custom Theme](https://backstage.io/docs/getting-started/app-custom-theme#creating-a-custom-theme) documentation

### Home Plugin

Beyond the installation of the Home plugin to get the most out of it you need to setup the initial code for it.

You can find the code in the [`HomePage.tsx`](https://github.com/backstage/demo/blob/master/packages/app/src/components/home/HomePage.tsx) file.

We have also setup the more advanced feature of the Home plugin that allows you to customize it more easily, the code for that in [`CustomizableHomePage.tsx`](https://github.com/backstage/demo/blob/master/packages/app/src/components/home/CustomizableHomePage.tsx)

To see the more advanced Home in the Demo site you will need to do the following:

1. Go to the [feature flags area](https://demo.backstage.io/settings/feature-flags)
2. Next click on the toggle labeled "customizable-home-page-preview"
3. Now refresh the page, feature flags are not reactive by design
4. Navigate to the Home by clicking on the "Home" icon in the sidebar
5. You should now see the more advanced Home, clicking on the "EDIT" button is a good place to start playing around with the features

More details on the Home plugin can be found in the [Backstage homepage - Setup and Customization](https://backstage.io/docs/getting-started/homepage) documentation.

### Search

The Search plugin has been expanded to include results from the Explore plugins Tools list. This has been done in two places:

1. Frontend changes are in the [`SearchPage.tsx`](https://github.com/backstage/demo/blob/master/packages/app/src/components/search/SearchPage.tsx) file
2. Backend changes are here the [`index.ts`](https://github.com/backstage/demo/blob/master/packages/backend/src/index.ts#L27) file

> Note: currently Search is setup on the frontend to include results from TechDocs but it is disabled in the backend due to a [bug that happens with an unusual setup](https://github.com/backstage/backstage/issues/23047) like the Demo site.

More information on adjusting search can be found in the [Customizing Search](https://backstage.io/docs/features/search/getting-started#customizing-search) documentation.

## Upgrading

This Demo site is kept in-sync with the weekly `next` release line as defined in the [Release Lines](https://backstage.io/docs/overview/versioning-policy#release-lines) documentation. Upgrading the Demo site has been automated so that a Pull Request with the latest changes is created the day after the weekly `next` release is published. This allows us to easily stay up to date!

The automation is done using a GitHub workflow but the concepts and most of its parts could easily be transferred to other CI/CD systems like Azure DevOps Pipelines, CircleCI, etc. The parts of this workflow can be found here:

- [Core workflow](https://github.com/backstage/demo/blob/master/.github/workflows/version-bump.yml)
- [Related scripts](https://github.com/backstage/demo/blob/master/scripts/set-release-name.js)

## Dependency Updates

As Backstage uses packages for its various dependencies these will need to be kept up to date. We use [Renovate](https://github.com/renovatebot/renovate?tab=readme-ov-file#why-use-renovate) as it is incredibly helpful in keeping dependency versions up to date. Renovate will create Pull Requests for the various dependencies and all we need to to is review and merge them!

You can see our Renovate configuration in the [`renovate.json`](https://github.com/backstage/demo/blob/master/renovate.json) file and example [Pull Requests here](https://github.com/backstage/demo/pulls?q=is%3Aopen+is%3Apr+label%3Adependencies)

> Note: you may not see any Pull Request as we very much like to stay on top of them, clicking on the "Closed" option will let you see examples that have been merged in the past.

To learn how to get started with Renovate we recommend reading the [Installing and onboarding Renovate into repositories](https://docs.renovatebot.com/getting-started/installing-onboarding/) documentation.

## Working With This Repo

The following sections are to help those working with this repo to keep in maintained.

### Local Docker

The Dockerfile in this repo can be built locally using the following command:

```bash
docker image build .  -t demo --build-arg ENVIRONMENT_CONFIG=local
```

This will build the image with your `app-config.local.yaml` included this allows you to include any config you might want to have in place for local testing.

Using `--progress=plain --no-cache` can also be helpful with testing changes.

You can then run it with this command:

```bash
docker run -it -p 7007:7007 demo
```
