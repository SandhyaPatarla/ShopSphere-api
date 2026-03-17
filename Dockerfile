FROM node:1.8
WORKDIR /app
copy package.json .
RUN npm install
COPY ..
CMD ["node","server.js"]


# docker build -t my-app .
# 