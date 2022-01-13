# Copy Apps
FROM node:16-alpine as APP_COPIER
WORKDIR /app
COPY ./test-apps/simple ./data-app
COPY ./function ./function-app

# Build function template
FROM node:16-alpine as FUNCTION_TEMPLATE_BUILDER
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
COPY --from=APP_COPIER /app .
COPY build.js build.js
RUN node build.js

# Build data app
FROM node:16-alpine as DATA_APP_BUILDER
WORKDIR /app/data-app
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/data-app/package.json package.json
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/data-app/yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/data-app .

# Build function app
FROM node:16-alpine as FUNCTION_APP_BUILDER
WORKDIR /app/function-app
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/function-app/package.json package.json
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/function-app/yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/function-app/proto ./proto
COPY --from=FUNCTION_TEMPLATE_BUILDER /app/index.js ./index.js

# Package
FROM node:16-alpine as PACKAGER
WORKDIR /app/data-app
COPY --from=DATA_APP_BUILDER /app/data-app .
WORKDIR /app/function-app
COPY --from=FUNCTION_APP_BUILDER /app/function-app .
RUN yarn add file:../data-app

# Deploy everything together
FROM node:16-alpine as DEPLOY
WORKDIR /app
COPY --from=PACKAGER /app .

WORKDIR /app/function-app
CMD [ "node", "index.js" ]
