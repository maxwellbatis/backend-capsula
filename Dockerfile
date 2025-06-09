FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy
EXPOSE 4000
CMD ["node", "server.js"]
