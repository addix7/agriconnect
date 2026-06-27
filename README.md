AgriConnect v1.0

> A full-stack agricultural supply chain platform connecting **Farmers**, **Middlemen**, and **Companies** through a transparent digital marketplace.

#  Problem Statement

Agricultural supply chains often suffer from:

- Lack of transparency
- Difficult inventory management
- No centralized communication between stakeholders
- Inefficient order tracking

AgriConnect aims to digitize this workflow by providing a complete platform where products can be listed, transferred, purchased, and tracked from farm to delivery.

---

#  Features

##  Farmer

- Secure Login & Registration
- Add Products
- View Own Products
- Transfer Products to Middlemen
- View Product Inventory

---

##  Middleman

- Register as Middleman
- Receive Products from Farmers
- Manage Inventory
- Accept / Reject Company Orders
- Track Deliveries
- Mark Orders as Delivered

---

##  Company

- Browse Available Stock
- Place Orders
- Track Order Status
- View Purchase History

---

##  Authentication

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Role Based Authorization

---

#  Supply Chain Workflow


Farmer
   │
   ▼
Creates Product
   │
   ▼
Transfers Product
   │
   ▼
Middleman Inventory
   │
   ▼
Company Places Order
   │
   ▼
Middleman Confirms Order
   │
   ▼
Delivery Tracking
   │
   ▼
Delivered



Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

#  Project Structure

```
AgriConnect
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── index.js
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
```

---

#  Current Features

- User Authentication
- Farmer Dashboard
- Middleman Dashboard
- Company Dashboard
- Product Management
- Product Transfer
- Inventory Management
- Company Order Placement
- Order Acceptance / Rejection
- Delivery Tracking
- Dark / Light Theme

---

## screenshots
-login
<img width="1201" height="590" alt="image" src="https://github.com/user-attachments/assets/4ec94af1-79e7-4720-aacc-c312eed6b59c" />
-farmer
<img width="1260" height="587" alt="image" src="https://github.com/user-attachments/assets/3fce4586-96ee-4860-a0de-d4ef9b455876" />
<img width="1275" height="621" alt="image" src="https://github.com/user-attachments/assets/58a52c46-8339-4b1e-ae7f-97ba0aac13ac" />
<img width="1255" height="581" alt="image" src="https://github.com/user-attachments/assets/ff06320a-112b-4cf2-b90f-9d83b4e672e9" />
<img width="1277" height="608" alt="image" src="https://github.com/user-attachments/assets/78e2350d-5162-48c7-a1d0-6158476edf00" />

-middleman
<img width="1273" height="606" alt="image" src="https://github.com/user-attachments/assets/ec218825-e68c-40e1-9a84-af67dc825bec" />
<img width="1280" height="644" alt="image" src="https://github.com/user-attachments/assets/7c0b662e-7c6f-4e74-905a-8c66cd2e7be0" />
<img width="1280" height="662" alt="image" src="https://github.com/user-attachments/assets/faba11fb-47f8-474a-ae97-819c4617dd85" />
<img width="1257" height="617" alt="image" src="https://github.com/user-attachments/assets/5842f2e5-8fee-4509-97d9-86f97c9ec582" />
<img width="1257" height="629" alt="image" src="https://github.com/user-attachments/assets/6f0951dc-8416-4f53-a2a6-9113f5edfa56" />

-company
<img width="1271" height="626" alt="image" src="https://github.com/user-attachments/assets/60b1634e-4a1f-407e-97c1-0a2ab446a43f" />
<img width="1274" height="620" alt="image" src="https://github.com/user-attachments/assets/3b1810dc-1ca8-419d-868c-68c1596afe14" />
<img width="1280" height="611" alt="image" src="https://github.com/user-attachments/assets/42ce62f4-d111-4dff-94b3-5719946db96e" />
<img width="1280" height="627" alt="image" src="https://github.com/user-attachments/assets/b158b59c-13e5-4ad9-bca4-611d57744c93" />





#  Planned Features (v1.1)

- Dashboard Analytics
- Charts & Reports
- Edit/Delete Products
- Notifications
- Search & Filters
- Image Upload for Products
- Better Profile Management
- Responsive Mobile UI

---

#  What I Learned

Building AgriConnect helped me understand:

- REST API Design
- JWT Authentication
- Role-Based Access Control
- MongoDB Relationships
- React State Management
- MERN Stack Development
- Full Stack Project Architecture

---

# ⚡ Installation

## Backend

```bash
cd backend
npm install
node index.js
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# about me (Developer)

**Kalp Pathak** :)
Cybersecurity student and aspiring Full Stack Developer.
Built as a learning project to understand real-world full-stack development and agricultural supply chain workflows.

---

⭐ If you like this project, consider giving it a star!
