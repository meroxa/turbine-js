FROM node:16-alpine
WORKDIR /data-app
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm ci --only=production
COPY . .

CMD [ "npx", "turbine-js-func" ]
