FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install pm2 -g
CMD pm2-runtime start index.js
EXPOSE 3000