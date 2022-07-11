
FROM node:16-alpine as 

# Build data app
WORKDIR /app/data-app
COPY ./data-app/package.json package.json
COPY ./data-app/package-lock.json package-lock.json
RUN npm ci --only=production
COPY ./data-app .

# Build function app
FROM node:16-alpine as FUNCTION_APP_BUILDER
WORKDIR /app/function-app
COPY ./function-app/package.json package.json
COPY ./function-app/yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
COPY ./function-app .

# Build everything together
FROM node:16-alpine as BUILDER
WORKDIR /app/data-app
COPY --from=DATA_APP_BUILDER ./app/data-app .
WORKDIR /app/function-app
COPY --from=FUNCTION_APP_BUILDER ./app/function-app .

#Set user permissions to nonroot 
USER nobody

CMD [ "node", "index.js" ]
