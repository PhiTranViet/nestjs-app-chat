# Sử dụng Node.js làm base image
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port 3000 để ứng dụng chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "run", "start:dev"]