FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# CRITICAL FIX: Added 'ENV' so Docker recognizes this instruction
ENV NODE_OPTIONS="--max-old-space-size=1024" 

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

COPY tsconfig.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/presentation/express/setting/index.js"]