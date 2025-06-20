# 🛒 E-commerce Platform

A modern full-stack e-commerce web application built with **React 19 + Vite** on the frontend and **Express.js + MongoDB** on the backend. The platform delivers a complete shopping experience with secure authentication, intelligent product search, VNPay payment integration, real-time customer support chat, and transactional email notifications.

An AI-powered assistant is integrated using **Google AI Gemini**, allowing users to receive smart product recommendations and automated support. Store owners also benefit from a robust admin dashboard to manage products, orders, customers, and sales analytics — all in one place.

---

## 🚀 Main Features

### 🛍️ Guest Users
- Browse products by category or keyword
- View detailed product pages (images, stock, price, description)
- Register for an account
- Chat with AI assistant for personalized product recommendations

### 👤 Authenticated Users (Customers)
- Login and update personal profile
- Add products to cart and manage quantity
- Place orders and pay securely via **VNPay**
- View updated order status from your order history page
- View order history and details
- Submit product reviews and ratings
- Chat with admin support in real time
- Get AI-powered shopping support anytime

### 🛠️ Store Admin
- Create, update and delete product listings
- Manage customer accounts
- View and update customer orders
- Analyze revenue and sales data via dashboard charts
- Chat directly with customers for support

---

## 🧱 Tech Stack

### 🌐 Frontend
- **React 19** + **Vite** for fast and modern frontend development  
- **Tailwind CSS** for utility-first and responsive styling  
- **Lucide**, **FontAwesome**, and **HeroIcons** for flexible, high-quality icon sets  
- **Zustand** for global state management with minimal boilerplate  
- **React Router v7** for seamless client-side routing  
- **Socket.io Client** to support real-time interactions such as live chat  
- **Recharts** for dynamic and customizable chart visualizations  
- **React Hot Toast** for clean and customizable toast notifications

### 🖥️ Backend
- **Express.js** + **MongoDB** (via Mongoose)  
- **JWT authentication** with bcryptjs  
- **OAuth login** via Passport (Google)  
- **Cloudinary** for media uploads  
- **VNPay** for payment gateway integration  
- **Socket.io** for real-time chat support  
- **Swagger UI** for auto-generated API documentation  
- **Resend** for transactional emails:
  - Send link to reset password
  - Notify users via email when order status is updated  
- **Google AI Gemini** (via `@google/genai`) to power AI-based product recommendation and user support chatbot

---

## 🌍 Deployment Links

- 🔗 Frontend (Client): [https://ecommercepwa-fe.netlify.app/user/login](https://ecommercepwa-fe.netlify.app/user/login)
- 🔗 Backend (Server): [https://ecommercepwa-be.onrender.com/](https://ecommercepwa-be.onrender.com/)
- 📚 API Docs (Swagger): [https://ecommercepwa-be.onrender.com/api-docs/](https://ecommercepwa-be.onrender.com/api-docs/)