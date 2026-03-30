# 🌾 AgriConnect – Backend System

AgriConnect is a backend system designed to streamline agricultural supply chain operations by connecting farmers, middlemen, and companies through a structured and trackable platform.

## 🚀 Problem Statement
Agricultural supply chains often lack transparency, leading to inefficiencies in pricing, inventory tracking, and product movement between stakeholders.

## 💡 Solution
AgriConnect provides a backend system that:
- Tracks crop inventory from farmers to middlemen
- Manages transactions and ownership
- Ensures secure and role-based access for different users
- Enables scalable integration for future company-level purchasing

## 🏗️ Architecture
- Built using **Node.js + Express**
- Follows **MVC (Model-View-Controller)** architecture
- Uses **MongoDB** for data storage
- Implements **JWT-based authentication**

## 🔐 Features
- User authentication (JWT + bcrypt)
- Role-based system (Farmer, Middleman, Company)
- Product management (crop listing)
- Inventory tracking via MiddlemanStock
- Secure API endpoints using middleware

## 🔄 Core Business Flow
Farmer → Adds Product  
Farmer → Transfers to Middleman  
Middleman → Manages inventory  
(Future) Company → Purchases from Middleman  

## 🧠 Key Learning
- Backend system design for real-world use cases  
- Authentication and security implementation  
- Database schema design and relationships  
- REST API development  

## ⚙️ Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JWT  
- bcrypt  

## 🚧 Current Status
This project is currently under development. Core backend functionalities are implemented, with upcoming features including:
- Company purchase system  
- Order management  
- Logistics and transport layer  
- Frontend integration  

## 👨‍💻 My Contribution
- Designed backend architecture using MVC pattern  
- Implemented authentication and authorization system  
- Built inventory and transaction flow logic  
- Developed REST APIs for core operations  

---

💡 This project demonstrates backend engineering skills and understanding of real-world supply chain systems.
