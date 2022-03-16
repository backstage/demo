# Stage 1 - Create yarn install skeleton layer
FROM node:16-bullseye-slim AS packages

WORKDIR /app
COPY package.json yarn.lock ./

COPY packages packages
# COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

# Stage 2 - Install dependencies and build packages
FROM node:14-buster AS build

WORKDIR /app
COPY --from=packages /app .

RUN yarn install --network-timeout 600000 && rm -rf "$(yarn cache dir)"

COPY . .

RUN yarn tsc
RUN yarn --cwd packages/backend backstage-cli backend:bundle --build-dependencies

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:14-buster

WORKDIR /app

# Copy from build stage
COPY --from=build /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# install sqlite3 dependencies
RUN apt-get update && \
    apt-get install -y libsqlite3-dev python3 cmake g++ && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

RUN yarn install --production --network-timeout 600000 && rm -rf "$(yarn cache dir)"

COPY --from=build /app/packages/backend/dist/bundle.tar.gz .
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

COPY app-config.yaml app-config.heroku.yaml ./

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
