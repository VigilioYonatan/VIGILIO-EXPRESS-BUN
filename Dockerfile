FROM oven/bun:1.1.4-debian as base
WORKDIR /usr/src/app

FROM base AS dependencies
WORKDIR /usr/src/app
RUN rm -rf .git
COPY package.json bun.lockb /usr/src/app
RUN bun install --platform=linux --arch=x64 sharp


FROM base AS development
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
CMD ["bun", "serve"]

FROM base AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN bun biome:format && bun biome:check \
    bun build:serve && \
    bun build:dev && \
    rm -rf node_modules && bun install --production && \ 
    bun install --platform=linux --arch=x64 sharp

FROM base AS production
WORKDIR /usr/src/app
COPY . .
COPY --from=build /usr/src/app/node_modules  ./node_modules
CMD ["bun","start"]