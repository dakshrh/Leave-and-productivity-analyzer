# Leave & Productivity Analyzer

A full-stack web application that ingests employee attendance data from Excel files, normalizes real-world Excel inconsistencies, stores records in MongoDB, and generates monthly productivity and leave analytics through a clean dashboard.

This project was built as part of an internship assignment with a strong focus on **real-world backend engineering challenges**, not just CRUD functionality.

---

## 🔍 Project Overview

Organizations often receive attendance data in Excel format, which introduces multiple challenges such as inconsistent date formats, time stored as fractions, and manual productivity calculation.

This application automates the entire pipeline:

**Excel → Backend Processing → Database → Analytics → Dashboard**

---

## 🚀 Key Features

- 📤 Upload attendance data via `.xlsx` Excel files
- 🧠 Robust Excel parsing & normalization
- 🗄 MongoDB persistence using Prisma ORM
- 📊 Monthly productivity & leave analytics
- ⏱ Accurate worked-hours calculation
- 🧑‍💼 Employee productivity dashboard
- 🧪 REST APIs for ingestion and summaries
- ⚙ Production-ready build (`next build`)

---

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes (Pages Router)
- Prisma ORM

### Database
- MongoDB Atlas

### Other Tools
- SheetJS (`xlsx`) for Excel parsing
- Git & GitHub

---

## 📁 Project Structure

src/
├── app/
│ ├── page.tsx # Excel upload UI
│ └── dashboard/page.tsx # Productivity dashboard
├── components/
│ ├── UploadExcel.tsx
│ └── SummaryCard.tsx
├── lib/
│ ├── excel.ts # Excel normalization logic
│ ├── calculations.ts # Worked hours calculation
│ └── prisma.ts
└── pages/api/
├── upload.ts # Excel ingestion API

📸 Screenshots

Screenshots of:
Excel upload flow 
<img width="925" height="563" alt="image" src="https://github.com/user-attachments/assets/189734a9-0bce-4502-be7e-029aae94df65" />

Successful data insertion
<img width="917" height="718" alt="image" src="https://github.com/user-attachments/assets/321b641d-9816-48e8-bb95-36c10aa04829" />

MongoDB records
<img width="1810" height="932" alt="image" src="https://github.com/user-attachments/assets/f94960c4-73ba-4d19-827e-1eb0253cc45f" />


Productivity dashboard
<img width="1243" height="735" alt="image" src="https://github.com/user-attachments/assets/a4e6c2b1-91fc-4a53-b44b-8e01d5c0d46f" />


---

## 📊 Productivity Logic

- **Working Day** → `workedHours > 0`
- **Leave Day** → `workedHours === 0`
- **Average Hours / Day** → `totalWorkedHours / workingDays`
- **Productivity %** → `(averageHoursPerDay / 8) × 100`

### Productivity Classification

| Avg Hours / Day | Label |
|----------------|------|
| ≥ 8            | Excellent |
| 6 – 7.99       | Good |
| 4 – 5.99       | Average |
| < 4            | Poor |

---

## 🧪 Sample Excel Format

| Employee Name | Date       | In-Time | Out-Time |
|--------------|------------|--------|----------|
| Daksh Rathi  | 19-12-2025 | 10:00  | 18:30   |

---

## 🧩 API Endpoints
### Upload Attendance

POST /api/upload

Uploads an Excel file, parses attendance data, and stores it in MongoDB.
### Monthly Summary

GET /api/summary?employeeId=<id>&month=12&year=2025

Returns productivity, leave, and working-hour analytics for a given month.

---

## ⚠ Real-World Challenges Faced & Solutions

### 1️⃣ Excel Time Stored as Fractions
**Problem:**  
Excel stores time as fractional values (e.g. `0.4166667` instead of `10:00`), which caused:
- Incorrect parsing
- `NaN` worked hours
- Prisma validation failures

**Solution:**  
Converted Excel time fractions into standard `HH:mm` format before calculations.

---

### 2️⃣ Multipart File Uploads in Next.js
**Problem:**  
Next.js API routes do not natively handle `multipart/form-data`.

**Solution:**  
Used `formidable` to correctly parse uploaded Excel files and extract the real file buffer.

---

### 3️⃣ Prisma Validation Errors
**Problem:**  
`workedHours` being `NaN` caused Prisma to reject inserts.

**Solution:**  
Ensured calculations always return valid numeric values and defaulted invalid cases to `0`.

---

### 4️⃣ App Router vs Pages Router Conflict
**Problem:**  
Mixing `app/` routes with `pages/api` caused build and routing confusion.

**Solution:**  
Kept UI logic in App Router and backend APIs strictly under Pages Router.

---

### 5️⃣ Turbopack & Windows Symlink Issues
**Problem:**  
Turbopack caused build failures on Windows due to symlink permission issues (especially with Prisma and `node_modules`).

**Solution:**  
Moved project out of OneDrive, reinstalled dependencies, and used stable production builds.

---

### 6️⃣ Security Advisory in `xlsx`
**Issue:**  
`npm audit` reports a high-severity vulnerability with no available fix.

**Assessment:**  
- Only trusted local Excel uploads
- No remote or user-generated file exposure  
Accepted as low risk for assignment scope, similar to real-world risk assessments.

---

## ▶ How to Run Locally

```bash
npm install
npx prisma generate
npm run dev

Open: http://localhost:3000

🚀 Future Enhancements

Authentication & role-based access
Multi-employee dashboard
Charts & trend analysis
Holiday & weekend detection
Cloud deployment (Vercel)

👤 Author

Daksh Rathi
AI & ML Enthusiast | Full-Stack Developer
Focused on building real-world, production-grade systems.



