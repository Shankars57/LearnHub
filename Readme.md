🚀 LearnHub – An Interactive Learning Platform
🌐 Live Demo

Frontend: https://learn-hub-rho.vercel.app

Backend: https://learnhub-e0dm.onrender.com

📖 About the Project

LearnHub is a modern full-stack learning and resource-sharing platform built using the MERN stack, where learners can:

Watch curated educational videos via the YouTube Data API

Chat in real-time with others using Socket.IO

Upload, share, and explore study materials

Receive email notifications and OTPs via Nodemailer

Log in seamlessly with Google Authentication

It’s designed to provide a collaborative, minimal, and fast environment for students and self-learners.

🧠 Core Features
🎥 Video Learning

Integrated YouTube API to fetch and display learning videos dynamically

Search topics and get relevant educational videos instantly

💬 Real-Time Chat

Built using Socket.IO for smooth, live communication

Typing indicators, message delivery confirmation, and room-based chats

📚 Material Sharing

Upload, download, and manage PDFs or resources

View subject-wise categorized materials

🔐 Authentication

Secure login/signup using Google OAuth 2.0

Custom user sessions and token-based authentication

📧 Email System

OTP verification and notifications via Nodemailer

Reliable and secure mailing setup for account verification

🌈 UI & Design

Clean, responsive UI built with Tailwind CSS

Smooth animations and transitions for better UX

🛠️ Tech Stack
Category Technologies
Frontend React.js, Tailwind CSS, Framer Motion
Backend Node.js, Express.js
Database MongoDB
Real-time Communication Socket.IO
Authentication Google OAuth 2.0
Email Service Nodemailer (Brevo/SMTP)
APIs Used YouTube Data API
Deployment Vercel (Frontend), Render (Backend)
⚙️ Installation Guide

To run LearnHub locally:

1️⃣ Clone the repository
git clone https://github.com/your-username/LearnHub.git
cd LearnHub

2️⃣ Setup Backend
cd backend
npm install

Create a .env file in the backend directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_USER=your_email_user
BREVO_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
FRONTEND_URL=http://localhost:5173

Run the backend:

npm run dev

3️⃣ Setup Frontend
cd frontend
npm install
npm run dev

💡 Future Enhancements

✅ Add AI-powered topic recommendations

✅ User profile customization

✅ Video playlist & bookmarking

✅ Forum and doubt-solving section

👨‍💻 Author

Bonam Chandra Durga Gowri Shankar
📍 B.Tech CSE | Aditya College of Engineering and Technology
🔗 LinkedIn

🌐 Portfolio
(optional)

⭐ Show Your Support

If you like this project, don’t forget to star 🌟 the repository and share it with others who love learning!
