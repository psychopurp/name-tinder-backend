FROM node:10.16.3-alpine


WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install nodemon -g
RUN cnpm install




EXPOSE 8793