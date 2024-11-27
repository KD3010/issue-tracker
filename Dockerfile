FROM node:22.1.0

WORKDIR /next

COPY package* .
COPY /prisma .

RUN npm install
RUN npx prisma generate
RUN npx prisma migrate

COPY . .

RUN cd /next
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
