FROM node:22.15 AS image-base

RUN npm i -g pnpm

FROM image-base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

FROM image-base AS build

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm build
RUN pnpm prune --prod 

FROM gcr.io/distroless/nodejs22-debian12 AS deploy

USER 1000
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3333

CMD ["dist/infra/http/server.js"]