FROM node:20.10-alpine3.19

RUN mkdir -p /home/node/zilla-frontend && chown -R node:node /home/node/zilla-frontend

WORKDIR /home/node/zilla-frontend

COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ /home/node/zilla-frontend/src/
COPY --chown=node:node public/ /home/node/zilla-frontend/public/
COPY --chown=node:node tsconfig.json /home/node/zilla-frontend/

USER node
RUN npm install