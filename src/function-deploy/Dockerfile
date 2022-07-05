
FROM node:16-alpine as 

#Set user permissions to nonroot 
RUN groupadd --gid 1000 nonroot \ 
    && useradd --uid 1000 --gid 1000 -ms /bin/false nonroot\
    && chown -R nonroot:nonroot /home/nonroot
USER nonroot

# Build data app
WORKDIR /app/data-app
COPY ./data-app/package.json package.json
COPY ./data-app/yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
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

CMD [ "node", "index.js" ]
