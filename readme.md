# Node.js 🛍️ eCommerce API ✨

This is a 🌐 RESTful eCommerce API built with **🟢 Node.js**, **🚀 Express.js**, and **🍃 MongoDB (🐭 Mongoose)**. It provides features such as 🔑 user authentication, 🛒 product management, 📦 orders, and 🛍️ cart functionality. 🔄🎉💡

## ✨ Features 🚀

- 🔐 User Authentication (Register, Login, JWT Authentication)
- 🛍️ Product Management (CRUD operations for products)
- 🛒 Cart Management (Add, Remove, Update items in cart)
- 📦 Order Management (Place orders, view order history)
- 🔒 Secure Routes with **JWT**
- 🍃 MongoDB Database with **Mongoose ORM**
- 📖 API Documentation with **Swagger**

## 🛠️ Tech Stack 🎨

- **🟢 Backend**: Node.js, Express.js
- **🗄️ Database**: MongoDB, Mongoose
- **🔐 Authentication**: JWT (JSON Web Tokens), bcrypt.js
- **🛡️ Middleware**: Express middleware for validation, error handling, and security

## ⚙️ Installation 🔧

### 1️⃣ Clone the repository 🛠️

```sh
git clone https://github.com/yourusername/ecommerce-api.git
cd ecommerce-api
```

### ⚙️ Prerequisites 📦

- Bun (Optional) - Ensure you have Bun installed if you want to use it.
- Node.js v20+ - This project requires Node.js version 20 or higher.

### 2️⃣ Install dependencies ⚡

```sh
npm install
```

### 3️⃣ Set up environment variables 🌍

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-uri
JWT_SECRET=your-secret-key
```

### 4️⃣ Run the server 💡

#### 🛠 Development Mode

```sh
npm run dev
```

#### 🚀 Production Mode

```sh
npm start
```

## 📜 License 🏛️

This project is licensed under the **📜 MIT License**. 🎖️💡📌

---

**💻 Happy Coding! 🚀🎯✨**
