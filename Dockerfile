ARG IMAGE=node:16.14.2

#COMMON
FROM $IMAGE as builder
WORKDIR /app
RUN mkdir --parents ~/.postgresql && wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" --output-document ~/.postgresql/root.crt && chmod 0600 ~/.postgresql/root.crt
COPY . .
RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy

#PROD MIDDLE STEP
FROM builder as prod-build
RUN npm run build
RUN npm prune --production

#PROD
FROM $IMAGE as prod
COPY --chown=node:node --from=prod-build /app/build /app/build
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build /app/package.json /app/package.json
COPY --chown=node:node --from=prod-build /app/prisma /app/prisma

ENV NODE_ENV=production
WORKDIR /app/build

CMD ["npm", "run", "start:prod"]

USER node
