ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT} AS build
COPY / /workdir/
WORKDIR /workdir/
RUN npm i -g npm
RUN npm i
WORKDIR /workdir/gamesweb/
RUN npm run build
WORKDIR /workdir/

FROM node
COPY / /web/
COPY --from=build /workdir/gamesweb/build/ /web/gamesweb/build/
COPY /.env.production /web/.env
WORKDIR /web/
RUN npm i -g npm
RUN npm i
EXPOSE 3000
CMD npx nodemon gamesapi/server.ts
