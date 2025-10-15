# 🏢 Room Booking App

A clean and minimal room booking system built with **Next.js**, **Prisma**, and **SQLite**.  
Users can view available rooms, select a time slot, and confirm a booking — all in a simple and responsive interface.

---

## 🚀 Tech Stack
- **Next.js (App Router)** – unified frontend and backend  
- **React** – client and server components  
- **Tailwind CSS** – utility-first styling  
- **Prisma ORM** – database modeling and querying  
- **SQLite** – lightweight local database  
- **TypeScript** – for safer and maintainable code  

---

## ⚙️ Getting Started

1️⃣ **Clone the repository**
```
git clone https://github.com/JesperHagman/room-booking.git
```

2️⃣ **Install dependencies**
```
npm install
```

3️⃣ **Create a `.env` file**
```
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4️⃣ **Setup the database**
```
npx prisma migrate dev --name init
npx prisma db seed
```

5️⃣ **Run the development server**
```
npm run dev
```

The app will be available at **http://localhost:3000** 🚀

---

## 🧩 Features
- View available rooms for the next three days (today + 2 days)  
- Real-time room availability and booking status  
- Prevents double bookings  
- Booking confirmation with automatic redirect after 10 seconds  
- Minimal and responsive design  
- Built with simplicity and readability in mind  

---

## 📁 Project Structure
```
room-booking/
│
├── src/
│   └── app/
│       ├── api/                   # API routes (rooms, availability, bookings)
│       │   ├── availability/      # Check room availability
│       │   ├── bookings/          # Handle new bookings
│       │   └── rooms/             # Fetch all rooms
│       │
│       ├── book/                  # Booking flow (selection + confirmation)
│       │   ├── confirm/           # Confirmation step
│       │   │   └── page.tsx
│       │   └── ui/                # UI components for booking pages
│       │       ├── BookClient.tsx
│       │       └── ConfirmClient.tsx
│       │
│       ├── globals.css            # Tailwind setup
│       ├── layout.tsx             # Global layout wrapper
│       ├── favicon.ico            # App icon
│       └── page.tsx               # Home page ("Book a room")
│
├── lib/
│   ├── prisma.ts                  # Prisma client configuration
│   └── time.ts                    # Time helper utilities
│
├── prisma/
│   ├── migrations/                # Prisma migrations
│   ├── dev.db                     # SQLite database
│   ├── schema.prisma              # Database schema (Room + Booking)
│   └── seed.js                    # Seeds default rooms
│
├── public/                        # Static assets (SVGs, icons, etc.)
│
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Lockfile
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

---

## 💡 Design & Logic
- **Time slots:** 08:00–17:00 (1-hour increments)  
- **Date range:** current day + two upcoming days  
- **Availability:** Past times are filtered out automatically  
- **UI layout:** Scrollable 3-column grid with sticky headers  
- **UX details:** Clean transitions, modal confirmation, and intuitive flow  
- **Error handling:** Prevents empty names and duplicate bookings  

---

## 🚧 Potential Improvements
- Add authentication and user accounts  
- Improve mobile layout (1 column per day)  
- Admin panel to manage rooms and bookings  
- Calendar integration (Google or Outlook)  

---

## ✅ Summary
A lightweight, full-stack booking app focused on **clarity, usability, and clean architecture**.  
Built to demonstrate **modern full-stack principles** with **Next.js, Prisma, and Tailwind**.

**Developed by:** _Jesper Hagman_  
📅 _October 2025_