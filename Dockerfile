FROM node:10.16.3-alpine

## 拷贝项目文件进行构建
#在此指令之后的操作，以及container的默认进入路径都将时 /path目录。
RUN mkdir /app

# RUN rm -f /etc/apt/sources.list
# COPY ./config/source.list /etc/apt/source.list

# RUN apt-get update
COPY ./package.json /app
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install nodemon -g
RUN cnpm install

VOLUME [ "/app" ]

WORKDIR /app

RUN echo "Hello nodeapp !"
EXPOSE 8793