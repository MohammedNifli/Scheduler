# 📅 Scheduler App

A powerful **meeting booking application** that allows users to seamlessly schedule meetings with Google OAuth, sync events with Google Calendar, and auto-generate Google Meet links — all with a modern, fast UI.

> 🚀 **Live on** [Vercel](https://vercel.com)

---

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

---

## 🔗 Live Demo

👉 [Try the App](scheduler-new-sooty.vercel.app)

---

## ✨ Features

- 🔐 Google OAuth2 Authentication
- 📆 Google Calendar API Integration
- 🎥 Auto-Generated Google Meet Links
- 📅 Schedule and Manage Meetings Easily
- ⚡ Turbocharged Performance with **Turbopack**
- 🌐 Deployed on **Vercel**

---

## 🧰 Tech Stack

| Layer        | Tech                                             |
|--------------|--------------------------------------------------|
| Frontend     | [Next.js](https://nextjs.org/)                   |
| Database     | [Neon](https://neon.tech/) (Serverless PostgreSQL) |
| ORM          | [Prisma](https://www.prisma.io/)                 |
| Auth         | [Google OAuth](https://developers.google.com/identity) |
| Deployment   | [Vercel](https://vercel.com/)                    |

---

## 📁 Project Structure
. ├── prisma/ # Prisma schema and migration files ├── pages/ # Next.js page routes ├── app/ # App directory (if using Next.js App Router) ├── components/ # Reusable React components ├── hooks/ # Custom React hooks ├── actions/ # Server actions (e.g., async operations) ├── lib/ # Utility functions and API handlers ├── public/ # Static files (images, icons, etc.) ├── styles/ # Global and modular styles └── ...


---

## 🚀 Getting Started

### 1. Clone the Repository



```bash
git clone https://github.com/your-username/scheduler-app.git
cd scheduler-app

```
2. Install Dependencies

npm install

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# 🌐 Database
DATABASE_URL=your_neon_db_connection_string

# 🔐 Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# 🔐 NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 📅 Google Calendar API
GOOGLE_PRIVATE_KEY=your_google_private_key
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_CALENDAR_ID=your_calendar_id

# 📧 Nodemailer (for sending confirmation/reminder emails)
EMAIL_FROM=your_email@example.com
EMAIL_PASSWORD=your_app_password  # App password (used with 2-step verification)
```


4.Generate Prisma Client

npx prisma generate

5.Run the App Locally

npm run dev


App will be available at http://localhost:3000


🔧 Available Scripts
Command	Description
npm run dev	Start development server with Turbopack
npm run build	Generate Prisma client & build project
npm run start	Start production server
npm run lint	Run ESLint
npm run vercel-build	Vercel-specific build script

.

👨‍💻 Author
Made with ❤️ by Mohammed Nifli ap










