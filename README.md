# ContactFuse – Identity Reconciliation API

A backend service that reconciles and consolidates user identity information based on email and phone number, following the Bitespeed Identity Reconciliation Task specification.

**Hosted Live:** [https://bitespeed-wl6u.onrender.com/identify](https://bitespeed-wl6u.onrender.com/identify)  
**GitHub Repo:** [https://github.com/gaurav0330/biteSpeed.git](https://github.com/gaurav0330/biteSpeed.git)

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoint](#api-endpoint)
- [Test Cases](#test-cases)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [License](#license)

---

## 🧩 Project Overview

The **ContactFuse** service processes contact data to:

- Identify existing contacts based on email or phone number.
- Create new contacts if no match is found.
- Link secondary contacts to primary ones.
- Merge multiple primary contacts into one based on creation time.
- Consolidate contact details to avoid duplication.

The service exposes a single `POST /identify` endpoint and returns a unified contact object.

---

## 🚀 Features

- 🔍 Contact identification by email or phone
- 🔗 Primary-secondary contact linking
- 🔁 Merge logic for conflicting contacts
- 🗑️ Soft deletion using `deletedAt`
- 📐 Type-safe codebase using TypeScript
- 🌐 Public API hosted on Render
- 💾 PostgreSQL on Neon with Prisma ORM

---

## 🛠️ Tech Stack

| Layer       | Tools                         |
|-------------|-------------------------------|
| Backend     | Node.js, Express, TypeScript  |
| ORM         | Prisma                        |
| Database    | PostgreSQL (Neon)             |
| Deployment  | Render                        |
| Testing     | Postman                       |

---

## 🧪 Getting Started

### 🔧 Prerequisites

- Node.js v20.18.0+
- npm v10.x+
- PostgreSQL (Neon or local)
- Git
- Postman (optional for testing)

### 📦 Installation

```bash
git clone https://github.com/gaurav0330/biteSpeed.git
cd biteSpeed
npm install
```

### 🔐 Environment Variables

Create a `.env` file:

```ini
DATABASE_URL="your_neon_postgresql_connection_string"
PORT=3000
```

Replace `DATABASE_URL` with your actual connection string.

### 🧱 Database Setup

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

### ▶️ Run the server

```bash
npm run start
# Local server: http://localhost:3000
```

---

## 📡 API Endpoint

**POST /identify**

**URL:**

- **Live:** [https://bitespeed-wl6u.onrender.com/identify](https://bitespeed-wl6u.onrender.com/identify)
- **Local:** [http://localhost:3000/identify](http://localhost:3000/identify)

**Headers:**
```json
Content-Type: application/json
```

**Request Format:**

```json
{
  "email": "string | null",
  "phoneNumber": "string | null"
}
```

**Response Format:**

```json
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

---

## ✅ Test Cases

### 1. New Contact

**Request:**

```json
{ "email": "lorraine@hillvalley.edu", "phoneNumber": "123456" }
```

**Response:**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### 2. Existing Contact with New Email

**Request:**

```json
{ "email": "mcfly@hillvalley.edu", "phoneNumber": "123456" }
```

**Response:**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

### 3. Phone Only

**Request:**

```json
{ "email": null, "phoneNumber": "123456" }
```

### 4. Invalid Input

**Request:**

```json
{ "email": null, "phoneNumber": null }
```

**Response:**

```json
{ "error": "At least one of email or phoneNumber is required" }
```

---

## 🚀 Deployment

**Deployed on Render**

**Live Endpoint:** [https://bitespeed-wl6u.onrender.com/identify](https://bitespeed-wl6u.onrender.com/identify)

**Render Settings:**

**Build Command:**

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**

```bash
npm run start
```

**Environment Variables:**

```ini
DATABASE_URL=your_neon_postgres_url
PORT=3000
```

## 📄 License

This project is licensed under the ISC License.

---

## 🔗  Live Details

- **GitHub:** [https://github.com/gaurav0330/biteSpeed.git](https://github.com/gaurav0330/biteSpeed.git)
- **Live API:** [https://bitespeed-wl6u.onrender.com/identify](https://bitespeed-wl6u.onrender.com/identify)
