ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT} AS build
COPY / /workdir/
WORKDIR /workdir/
RUN npm i -g npm
RUN rm package.json
RUN npm ci
WORKDIR /workdir/gamesweb/
RUN rm package.json
RUN npm ci
RUN npm run build
WORKDIR /workdir/

FROM node
COPY / /web/
COPY --from=build /workdir/gamesweb/build/ /web/gamesweb/build/
COPY /.env.production /web/.env
WORKDIR /web/
RUN npm i -g npm
RUN rm package.json
RUN npm ci --production
EXPOSE 3000
CMD npx nodemon gamesapi/server.ts
