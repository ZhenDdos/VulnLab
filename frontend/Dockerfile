FROM node:20-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

ENV PORT=5173
EXPOSE 5173

CMD [ "npm", "run", "dev"]

