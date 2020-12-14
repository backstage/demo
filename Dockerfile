FROM node:12-buster

WORKDIR /usr/src/app

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
ADD yarn.lock package.json ./
# Really annoying that you can't copy the tree easily using docker COPY command.
# https://github.com/moby/moby/issues/15858#issuecomment-383690925
ADD packages/backend/package.json ./packages/backend/package.json
ADD packages/app/package.json ./packages/app/package.json
ADD packages/local-techdocs-common/package.json ./packages/local-techdocs-common/package.json
ADD plugins/local-techdocs/package.json ./plugins/local-techdocs/package.json
ADD plugins/local-techdocs-backend/package.json ./plugins/local-techdocs-backend/package.json

RUN yarn install --frozen-lockfile --production

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

ENV PORT 7000

ENV GITHUB_PRODUCTION_CLIENT_ID ""
ENV GITHUB_PRODUCTION_CLIENT_SECRET ""

ENV GITHUB_DEVELOPMENT_CLIENT_ID ""
ENV GITHUB_DEVELOPMENT_CLIENT_SECRET ""

# For now we need to manually add these configs through environment variables but in the
# future, we should be able to fetch the frontend config from the backend somehow
ENV APP_CONFIG_app_baseUrl "https://demo.backstage.io"
ENV APP_CONFIG_backend_baseUrl "https://demo.backstage.io"
ENV APP_CONFIG_auth_environment "production"

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.heroku.yaml"]
