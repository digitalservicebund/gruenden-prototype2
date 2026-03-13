FROM node:25.8.1-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=7070

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 7070

USER node

CMD ["node", "app.js"]
