# Stage 1 - Create yarn install skeleton layer
FROM node:18-bookworm-slim AS packages

WORKDIR /app
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./

COPY packages packages
# COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

# Stage 2 - Install dependencies and build packages
FROM node:18-bookworm-slim AS build

# Set Python interpreter for `node-gyp` to use
ENV PYTHON /usr/bin/python3

# install sqlite3 dependencies
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=packages --chown=node:node /app .
COPY --from=packages --chown=node:node /app/.yarn ./.yarn
COPY --from=packages --chown=node:node /app/.yarnrc.yml  ./

# Stop cypress from downloading it's massive binary.
ENV CYPRESS_INSTALL_BINARY=0
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --immutable

COPY --chown=node:node . .

RUN yarn tsc
# RUN yarn --cwd packages/backend backstage-cli backend:bundle --build-dependencies
RUN yarn --cwd packages/backend build

RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:18-bookworm-slim

# Set Python interpreter for `node-gyp` to use
ENV PYTHON /usr/bin/python3

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

# From here on we use the least-privileged `node` user to run the backend.
USER node

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# Copy the install dependencies from the build stage and context
COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml  ./
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production

# Copy the built packages from the build stage
COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./

COPY --chown=node:node app-config.yaml app-config.heroku.yaml ./

ENV PORT 7000
ENV NODE_ENV production

ENV GITHUB_PRODUCTION_CLIENT_ID ""
ENV GITHUB_PRODUCTION_CLIENT_SECRET ""

ENV GITHUB_DEVELOPMENT_CLIENT_ID ""
ENV GITHUB_DEVELOPMENT_CLIENT_SECRET ""

# For now we need to manually add these configs through environment variables but in the
# future, we should be able to fetch the frontend config from the backend somehow
ENV APP_CONFIG_app_baseUrl "https://demo.backstage.io"
ENV APP_CONFIG_backend_baseUrl "https://demo.backstage.io"
ENV APP_CONFIG_auth_environment "production"
ENV NODE_OPTIONS "--max-old-space-size=400"

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.heroku.yaml"]
