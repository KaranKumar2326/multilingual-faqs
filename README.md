

# 📌 Multilingual FAQs System

A **Node.js-based multilingual FAQ system** that supports translations in **English, Hindi, and Bengali**.  
It uses **MongoDB for storage**, **Redis for caching**, and **Python (Google Translate API) for translations**.

---

## 🛠 Technologies Used

- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose ORM)  
- **Caching**: Redis (Translation caching)  
- **Translation**: Python (Google Translate API - `googletrans`)  
- **Frontend**: HTML + JavaScript (Admin Panel)  
- **Containerization**: Docker & Docker Compose  

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/KaranKumar2326/multilingual-faqs.git
cd multilingual-faqs
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Start MongoDB & Redis**
- If using **Docker**:
```bash
docker compose up -d
```
- If running **locally**:
  - **MongoDB**: Run `mongod` (or start via MongoDB Compass)
  - **Redis**: Run `redis-server`

### **4️⃣ Install Python & Dependencies**
- **Ensure Python is installed** (`python3 --version`)
- Install `googletrans`
```bash
pip install googletrans==4.0.0-rc1
```

### **5️⃣ Start the Server**
```bash
npm start
```
- The server runs at **`http://localhost:8000`**.

---

## 🖥️ Admin Panel (Web Interface)

The **Admin Panel** provides a web-based interface to **manage FAQs** with multilingual support.

### **🔗 Access the Admin Panel**
```
http://localhost:8000/admin.html
```

### **📝 Features**
✅ Add/Edit FAQs  
✅ Automatic Translation (English, Hindi, Bengali)  
✅ View Translations  
✅ Pagination & Search  
✅ Delete FAQs  

---

## 📌 API Endpoints

### **1️⃣ Create a New FAQ**
**POST** `/api/faqs`
```json
{
  "question": "What is Express?",
  "answer": "Express is a web framework."
}
```
_Response:_
```json
{
  "question": "What is Express?",
  "answer": "Express is a web framework.",
  "translations": {
    "hi": { "question": "एक्सप्रेस क्या है?", "answer": "एक्सप्रेस एक वेब फ्रेमवर्क है।" },
    "bn": { "question": "এক্সপ্রেস কি?", "answer": "এক্সপ্রেস একটি ওয়েব ফ্রেমওয়ার্ক।" }
  }
}
```

### **2️⃣ Get All FAQs (Paginated)**
**GET** `/api/faqs?page=1&limit=5`

_Response:_
```json
{
  "data": [
    {
      "_id": "67a0b99484ba1d9be87c3be6",
      "question": "What is Express?",
      "answer": "ok.",
      "translations": {
        "hi": { "question": "एक्सप्रेस क्या है?", "answer": "ठीक है।" },
        "bn": { "question": "এক্সপ্রেস কি?", "answer": "ঠিক আছে।" }
      }
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

### **3️⃣ Get FAQs with Translations**
**GET** `/api/faqs/all?lang=hi`

_Response:_
```json
[
  {
    "question": "एक्सप्रेस क्या है?",
    "answer": "ठीक है।"
  }
]
```

### **4️⃣ Update an FAQ**
**PUT** `/api/faqs/:id`
```json
{
  "question": "Updated Question?",
  "answer": "Updated Answer."
}
```
_Response:_
```json
{
  "message": "FAQ updated successfully",
  "question": "Updated Question?",
  "translations": {
    "hi": { "question": "अद्यतन प्रश्न?", "answer": "अद्यतन उत्तर।" },
    "bn": { "question": "আপডেট প্রশ্ন?", "answer": "আপডেট উত্তর।" }
  }
}
```

### **5️⃣ Delete an FAQ**
**DELETE** `/api/faqs/:id`

_Response:_
```json
{
  "message": "FAQ deleted successfully"
}
```

---

## 🔄 Caching with Redis

- Translations are stored in **Redis** for faster responses.
- **Cache Expiry:** 1 hour (`EX: 3600`).
- **Manual Cache Check:**
```bash
docker exec -it multilingual-faqs-redis redis-cli
keys *
```

---

## 📦 Docker Deployment

### **Using Docker Compose**
```bash
docker compose up --build -d
```
- The app will be available at **`http://localhost:8000`**.

### **Dockerfile**
```dockerfile
# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install Python (needed for translation)
RUN apt-get update && apt-get install -y python3 python3-pip

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Python dependencies
RUN pip3 install googletrans==4.0.0-rc1

# Copy the entire project
COPY . .

# Expose the required port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
      - redis
    environment:
      - REDIS_HOST=redis
      - MONGO_URI=mongodb://mongodb:27017/multilingual-faqs

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

---

## 🔗 Repository

🔗 **GitHub:** [KaranKumar2326/multilingual-faqs](https://github.com/KaranKumar2326/multilingual-faqs.git)

---

## 🙌 Contributing

- **Fork** the repo & clone it  
- **Create a feature branch** (`git checkout -b feature-name`)  
- **Commit changes** (`git commit -m "feat: Added caching to API"`)  
- **Push and create a pull request**  

---
```
