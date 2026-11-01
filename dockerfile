FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

ARG GITHUB_TOKEN

CMD ["npm", "start"]
