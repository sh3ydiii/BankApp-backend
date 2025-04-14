# Используем официальный Node.js образ
FROM node:18

# Создаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт
EXPOSE 5000

# Команда запуска
CMD ["npm", "run", "dev"]
