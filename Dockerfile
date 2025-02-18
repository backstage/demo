# Global scope
ARG ENVIRONMENT_CONFIG=heroku

# Stage 1 - Create yarn install skeleton layer
FROM node:20-bookworm-slim@sha256:5da391c4b0398f37074b6370dd9e32cebd322c2a227053ca4ae2e7a257f0be21 AS packages
ARG ENVIRONMENT_CONFIG

WORKDIR /app
COPY backstage.json package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./

COPY packages packages
COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

# Stage 2 - Install dependencies and build packages
FROM node:20-bookworm-slim@sha256:5da391c4b0398f37074b6370dd9e32cebd322c2a227053ca4ae2e7a257f0be21 AS build
ARG ENVIRONMENT_CONFIG

# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 g++ build-essential && \
    rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app

COPY --from=packages --chown=node:node /app .
COPY --from=packages --chown=node:node /app/.yarn ./.yarn
COPY --from=packages --chown=node:node /app/.yarnrc.yml  ./
COPY --from=packages --chown=node:node /app/backstage.json  ./

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --immutable

COPY --chown=node:node . .

RUN yarn tsc
RUN yarn --cwd packages/backend build

RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM node:20-bookworm-slim@sha256:5da391c4b0398f37074b6370dd9e32cebd322c2a227053ca4ae2e7a257f0be21
ARG ENVIRONMENT_CONFIG

# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev g++ build-essential \
    python3 python3-pip python3-venv \
    curl default-jre graphviz fonts-dejavu fontconfig && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core

RUN curl -o plantuml.jar -L https://github.com/plantuml/plantuml/releases/download/v1.2023.10/plantuml-1.2023.10.jar && echo "527d28af080ae91a455e7023e1a726c7714dc98e plantuml.jar" | sha1sum -c - && mv plantuml.jar /opt/plantuml.jar
RUN echo '#!/bin/sh\n\njava -jar '/opt/plantuml.jar' ${@}' >> /usr/local/bin/plantuml
RUN chmod 755 /usr/local/bin/plantuml

# From here on we use the least-privileged `node` user to run the backend.
USER node

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# Copy the install dependencies from the build stage and context
COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml  ./
COPY --from=build --chown=node:node /app/backstage.json  ./
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production

# Copy the built packages from the build stage
COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./

# Copy any other files that we need at runtime
COPY --chown=node:node app-config.yaml app-config.*.yaml ./

# Heroku will assign the port dynamically; the default value here will be overridden by what Heroku passes in
# For local development the default will be used
ENV PORT=7007
# This switches many Node.js dependencies to production mode.
ENV NODE_ENV=production
# Sets the max memory size of V8's old memory section
# Also disables node snapshot for Node 20 to work with the Scaffolder
ENV NODE_OPTIONS="--max-old-space-size=1000 --no-node-snapshot"

# Default is 'heroku', for local testing pass in 'local'
ENV ENVIRONMENT_CONFIG=${ENVIRONMENT_CONFIG}

CMD ["sh", "-c", "node packages/backend --config app-config.yaml --config app-config.${ENVIRONMENT_CONFIG}.yaml"]
