FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8100

CMD ["npx", "ionic", "serve", "--host", "0.0.0.0", "--port", "8100"]