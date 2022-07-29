FROM node:16-alpine

# Build data app
WORKDIR /app
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm ci --only=production
COPY . .

#Set user permissions to nonroot
USER nobody

# npm doesnt like the altered permissions, so we run the executable w node :lolsob:
ENTRYPOINT [ "node", "./node_modules/@meroxa/turbine-framework/bin/turbine-framework", "function"]
