FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG GITHUB_TOKEN

ENV PORT=3000

EXPOSE 3000

RUN ["npm", "run", "build"]

CMD ["npm", "run", "start"]
