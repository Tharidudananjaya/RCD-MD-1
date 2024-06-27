FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
  npm init -y
  npm install @whiskeysockets/baileys pino fs path awesome-phonenumber file-type

COPY package.json .

RUN npm i && npm i -g qrcode-terminal

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
