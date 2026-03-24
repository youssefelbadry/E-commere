<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
   
   ## 📖 Project Overview

A scalable and production-ready **E-commerce Backend System** built with **NestJS** and **TypeScript**.

✔ Authentication & Authorization  
✔ Product, Category & Brand Management  
✔ Cart & Pricing System  
✔ Coupon System  
✔ Order Management  
✔ Payment Integration (Stripe)  
✔ Wishlist System  

---

## 🛠 Tech Stack

🔹 Node.js  
🔹 NestJS  
🔹 TypeScript  
🔹 MongoDB (Mongoose)  
🔹 JWT Authentication  
🔹 Stripe  
🔹 Zod & class-validator  

---

## 🚀 Features

### 🔐 Authentication & Security
✔ JWT Authentication  
✔ Role-Based Access (USER / ADMIN)  
✔ Guards (AuthGuard, RolesGuard)  
✔ Email Confirmation & Reset Password (OTP)  

### 🛍 Product System
✔ Product CRUD with image upload  
✔ Category & Brand relations  

### 🛒 Cart System
✔ Add / Update / Remove items  
✔ Dynamic pricing (tax, shipping, discount, total)  

### 🎟 Coupon System
✔ Expiration & usage limits  
✔ Apply / Remove coupon  

### 📦 Order System
✔ Create order from cart  
✔ Order lifecycle (cart → order → payment → status)  

### 💳 Payment
✔ Stripe integration  

---

## 🏗 Architecture

🔹 Modular Architecture (NestJS)  
🔹 Controller / Service / Repository layers  
🔹 Generic BaseRepository (reusable CRUD)  
🔹 Clean separation of concerns  

---

## 🧠 Business Logic

✔ Pricing engine (subtotal, tax, shipping, discount)  
✔ Coupon validation system  
✔ Cart → Order mapping  