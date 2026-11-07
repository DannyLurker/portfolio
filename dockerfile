# syntax=docker/dockerfile:1

FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

RUN --mount=type=secret,id=github_token,env=GITHUB_TOKEN \
    npm run build

CMD ["npm", "run", "start"]