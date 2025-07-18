# 🧠 Bitespeed Identity Reconciliation Service

This project is a web service designed to handle identity reconciliation for an e-commerce platform. It provides a backend API endpoint that intelligently identifies and consolidates customer contact information (email and phone number) across multiple orders, linking them to a single primary identity. It also includes a basic frontend client for demonstrating and testing the API.

---

## ✨ Live Demo

- **Backend API Endpoint**: 
>[https://bitespeed-backend-task-pyoush-madan.onrender.com/](https://bitespeed-backend-task-pyoush-madan.onrender.com/)
- **Frontend Client**: 
>[https://bitespeed-backend-task-pyoush-madan-1.onrender.com/](https://bitespeed-backend-task-pyoush-madan-1.onrender.com/)

---

## 🖼️ Algorithm

> Endpoint Algorithm for /identify

![Preview](./endpoint_algorithm.png)

---
## 🖼️ E-R Diagram

![Preview](./ER_diagram.png)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma (ORM)
- **Frontend**: HTML, CSS, JavaScript (no framework)
- **Deployment**: Render.com

---

## 📂 Folder Structure
```bash
bitespeed-project/
├── .gitignore
├── README.md
├── backend/
│ ├── .env
│ ├── prisma/
│ │ └── schema.prisma
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── services/
│ │ └── index.ts
│ ├── package.json
│ └── tsconfig.json
└── frontend/
├── index.html
├── script.js
└── style.css
```
---

## 📝 API Documentation

### POST `/identify`

Identify a customer based on the provided email or phone number. Finds existing contacts, merges profiles, or creates a new contact as per the linking rules.

#### 📥 Request Body
```json
{
"email": "user@example.com",
"phoneNumber": "1234567890"
}
```
#### 📤 Success Response (`200 OK`)
```json
{
"contact": {
"primaryContatctId": 1,
"emails": ["user@example.com"],
"phoneNumbers": ["1234567890"],
"secondaryContactIds": [2]}
}
```
---

## ⚙️ Getting Started

### 🔧 Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/` folder:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
```

4. Run the Prisma migration to create the database schema:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The backend should now be running at: 
```bash
(http://localhost:3000)
```
---

### 💻 Frontend Setup

1. Open the `frontend/script.js` file.

2. Update the API URL to point to your local backend:
```bash
const apiUrl = 'http://localhost:3000/identify';
```
3. Launch the frontend:

- Open `frontend/index.html` directly in your browser (no build required).

---

## 📬 Contact

For questions, feedback, or contributions, feel free to reach out or open an issue.

---