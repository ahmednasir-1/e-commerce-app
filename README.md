# 📚 BookHaven — Full-Stack Bookstore E-Commerce

A production-ready MERN stack bookstore application with phone & email OTP verification, Cloudinary image uploads, Twilio SMS notifications, Resend email notifications, and a full admin panel.

---

## 🚀 Tech Stack

**Frontend**
- React (Vite) + React Router v6
- Tailwind CSS
- TanStack React Query
- Axios with JWT interceptors
- React Hot Toast

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (memory storage)

**Third-Party Services**
- **Cloudinary** — Book cover image uploads
- **Twilio Verify** — Phone number OTP verification & SMS order notifications
- **Resend** — Email OTP verification & order confirmation emails

---

## ✨ Features

### User
- 📱 Multi-step signup with **email OTP** (Resend) + **phone OTP** (Twilio) verification
- 🔐 JWT-based login / logout
- 📖 Browse all books with **search** (title/author) and **filter** (category)
- ⚡ Stock badges — "Only X left!" warning when stock ≤ 5
- 🛒 Add to cart with real-time stock validation
- ➕ Increase / decrease quantity (capped at available stock)
- 📦 Checkout with shipping address (Cash on Delivery)
- 📋 My Orders page with order history and status tracking
- 📧 Email confirmation on order placed
- 📲 SMS notification on order placed and status updates

### Admin
- 👥 View all users and their orders
- 📚 Add / edit / delete books with image upload (Cloudinary)
- 🔄 Update order status (pending → confirmed → processing → shipped → delivered → cancelled)
- 📲 SMS + email sent to user automatically on status change

---


## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev

CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ahmednasir-1/e-commerce-app.git
cd e-commerce-app
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment variables

Copy the env examples above into `backend/.env` and `frontend/.env` and fill in your credentials.

### 4. Seed the database

```bash
cd backend
node seed.js
```

This creates 12 sample books and 1 admin account:
- **Email:** `admin@bookstore.com`
- **Password:** `admin123`

### 5. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---


## 📱 Twilio Setup

1. Create account at [twilio.com](https://twilio.com)
2. Copy **Account SID** and **Auth Token** from the Console Dashboard
3. Buy a phone number: **Phone Numbers → Buy a number**
4. Create Verify Service: **Verify → Services → Create new** → name it `BookStore` → enable SMS
5. Copy the **Service SID** (starts with `VA...`)
6. Enable Pakistan (or your country): **Verify → Settings → Geo-Permissions**

> **During development** set `NODE_ENV=development` to bypass all Twilio/Resend calls and use OTP code `123456` locally.

---

## 📧 Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Go to **API Keys → Create API Key** → copy the key
3. Free tier: send from `onboarding@resend.dev` (3,000 emails/month)
4. For custom domain: **Domains → Add** → verify DNS records

---

## ☁️ Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy **Cloud Name**, **API Key**, and **API Secret** from the Dashboard
3. Images are stored in the `bookstore/books` folder automatically

---

## 🔄 Order Status Flow

```
pending → confirmed → processing → shipped → delivered
                                           ↘ cancelled
```

Each status change sends an SMS and email to the customer automatically.

---

## 🛡️ Stock Management

- Books with `stock === 0` show **"Out of Stock"** — Add to Cart disabled
- Books with `stock ≤ 5` show **"⚡ Only X left!"** pulsing badge
- Cart quantity is capped at available stock (frontend + backend validation)
- Stock is decremented automatically when an order is placed

---

## 📦 Payment

Currently supports **Cash on Delivery (COD)** only. Stripe integration can be added by installing `stripe` and creating a payment intent before order confirmation.

---


## 📄 License
© 2025 BookHaven
