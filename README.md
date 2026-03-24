<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
   
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
🔹 Stripe (Payments)  
🔹 Zod & class-validator (Validation)  
🔹 Multer / Cloudinary (File Uploads)  

---

## 🔐 Authentication & Security

✅ Signup / Login  
✅ JWT Authentication  
✅ Role-Based Access (USER / ADMIN)  
✅ Guards (AuthGuard, RolesGuard)  
✅ Password Hashing  
✅ Email Confirmation (OTP)  
✅ Reset Password (OTP)  

---

## 👤 User System

✔ User Profile Management  
✔ Upload Profile Image  
✔ Role Management (Admin / User)  

---

## 🛍 Product System

✔ Create / Update / Delete Product  
✔ Upload Product Image  
✔ Get Products (with filtering)  
✔ Get Product by Slug  
✔ Relation with Category & Brand  

---

## 🏷 Category & Brand System

### Category
✔ Create / Update / Delete  
✔ Upload Image  
✔ Get by Slug  

### Brand
✔ Create / Update / Delete  
✔ Upload Logo  
✔ Get by Slug  

---

## 🛒 Cart System

✔ Add Product to Cart  
✔ Update Quantity  
✔ Remove Item  
✔ Clear Cart  
✔ Get My Cart  

### Pricing Logic

✔ Subtotal Calculation  
✔ Tax Handling  
✔ Shipping Fees  
✔ Discount System  
✔ Total Price Calculation  

✔ Automatic price calculation using hooks  

---

## 🎟 Coupon System

✔ Create / Update / Delete Coupon  
✔ Apply Coupon to Cart  
✔ Remove Coupon  

### Rules

✔ Expiration Date  
✔ Usage Limit  
✔ Active / Inactive Status  
✔ Discount Calculation  

---

## 📦 Order System

### User

✔ Create Order from Cart  
✔ Get My Orders  
✔ Get Single Order  
✔ Cancel Order  

### Admin

✔ Get All Orders  
✔ Update Order Status  

### Order Flow

Cart → Order → Payment → Status  

---

## 💳 Payment System

✔ Stripe Integration  
✔ Secure Payment Handling  
✔ Payment Status Tracking  

---

## ❤️ Wishlist System

✔ Add Product to Wishlist  
✔ Remove Product  
✔ Get Wishlist  

---

## 🧠 Business Logic

✔ Cart Pricing Engine  
✔ Coupon Validation Logic  
✔ Order Mapping from Cart  
✔ Stock & Validation Handling  

---

## 🏗 Architecture

🔹 Modular Architecture (NestJS)  
🔹 Controller / Service / Repository Layers  
🔹 Generic BaseRepository (Reusable CRUD)  
🔹 Pagination & Query Handling  
🔹 Clean Separation of Concerns  

---

## 🛡 Validation & Interceptors

✔ DTO Validation  
✔ Zod Validation  
✔ class-validator  

✔ Logging Interceptor  
✔ Response Interceptor  

---

## 🔗 Database Models

✔ User  
✔ Product  
✔ Category  
✔ Brand  
✔ Cart  
✔ Coupon  
✔ Order  
✔ Wishlist  
✔ OTP  

---

## 🔗 Relationships

✔ Product → Category  
✔ Product → Brand  
✔ Cart → Products  
✔ Order → User  
✔ Order → Products  
✔ Category → Brands  

---

## 🎯 What I Practiced

✔ Building Scalable Backend Systems  
✔ Real-World Business Logic Implementation  
✔ Secure Authentication & Authorization  
✔ Payment Integration (Stripe)  
✔ Clean Architecture & Design Patterns  

---

## 🔮 Future Improvements

🔹 Caching (Redis)  
🔹 Notifications System  
🔹 Advanced Filtering & Search  
🔹 Performance Optimization  
🔹 Microservices Architecture  