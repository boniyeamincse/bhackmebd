FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install && npm rebuild

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["node", "src/index.js"]
