FROM node:22.1.0

WORKDIR /nextapp

COPY package* .
COPY /prisma .

RUN npm install
RUN npx prisma generate
RUN npx prisma migrate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]