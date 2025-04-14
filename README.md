
<h1 align="center">🏦 BankApp - Backend</h1>

<p align="center">
  <b>Backend for the banking app built with Node.js, MongoDB, and Docker</b><br>
  <i>Developed with love for clean code and stable architecture</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-%2347A248.svg?logo=mongodb" />
  <img src="https://img.shields.io/badge/Docker-%230db7ed.svg?logo=docker" />
  <img src="https://img.shields.io/badge/nodemon-enabled-brightgreen" />
</p>

---

## 📦 Tech Stack

- **Node.js** — Логика на сервере
- **Express.js** — Фреймворк для построения API
- **MongoDB** — База данных
- **JWT Token** — Безопасный способ передачи информации между сторонами для аутентификации и авторизации
- **Mongoose** — ODM для MongoDB
- **Docker** — Контейнеризация
- **Nodemon** — Автоматический перезапуск сервера при изменениях в коде

---

## 📁 Project Structure

```
.
├── /controllers
├── /dtos
├── /exceptions
├── /middleware
├── /models
├── /routes
├── /service
├── /validation
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
├── server.js
```

---

## ⚙️ Setting up and Running the Project

> ⚠️ Make sure you have Docker and Docker Compose installed.

### 🔄 Step 1: Clone the repository

```bash
git clone https://github.com/sh3ydiii/BankApp-backend
cd bank-backend
```

### 🐳 Step 2: Build and run the containers

```bash
docker-compose up --build
```

After building, you should see the logs for MongoDB and the backend server. The backend will be available at:

```
http://localhost:5003
```

### 🛑 Step 3: Stopping the containers

```bash
docker-compose down
```

---

## 🐳 Docker Files

### 📄 Dockerfile

```Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

### ⚙️ docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "5003:5000"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## 📡 API Endpoints

| Method | Route                        | Description                            | Parameters                          |
|--------|------------------------------|----------------------------------------|-------------------------------------|
| POST   | `/registration`              | Register by phone number (send code)   | `number`                            |
| POST   | `/registration/verify-code`  | Verify code and create user            | `number, code`                      |
| GET    | `/home`                      | Retrieve user and card information     | `Authorization: Bearer <JWT Token>` |
| POST   | `/send-code`                 | Send code to phone number              | `number`                            |
| POST   | `/login`                     | Login by number and code               | `number, code`                      |
| POST   | `/logout`                    | Log out of the account                 | `Cookie: <JWT Token>`               |
| POST   | `/refresh`                   | Refresh JWT tokens                     | `Cookie: <JWT Token>`               |
| POST   | `/card/create`               | Create a card                          | `number, name, surname, patronymic` |
| GET    | `/card`                      | Retrieve user card                     | `number, name, surname, patronymic` |
| DELETE | `/card`                      | Block a card                           | `Authorization: Bearer <JWT Token>` |
| POST   | `/home/payment/number`       | Transfer money by phone number         | `Authorization: Bearer <JWT Token>, number, amount` |
| POST   | `/home/payment/card`         | Transfer money by card number          | `Authorization: Bearer <JWT Token>, number, amount` |
| GET    | `/check`                     | Retrieve payment receipts              | `Authorization: Bearer <JWT Token>` |
| GET    | `/check/:ticker`             | View receipt by ticket number          | `Authorization: Bearer <JWT Token>` |

---

## 🧪 Development without Docker

If you want to run the project without Docker:

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm run dev
```

⚠️ Make sure MongoDB is running locally at `mongodb://localhost:27017`.

---

## 🧼 Cleaning up Docker

To clean up all stopped containers and resources:

```bash
docker system prune
```

---

## 📬 Contact

- Telegram: [@codinginmyheart](https://t.me/codinginmyheart)
- Email: sh3ydiii@mail.com

---

## 📄 License

This project is licensed under the [MIT License](https://mit-license.org/).
