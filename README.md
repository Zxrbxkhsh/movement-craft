# Movement Craft — Luxury Surprise Event Planning Platform

A full-stack web application designed for **Movement Craft**, a luxury surprise event planning business in Chhatrapati Sambhaji Nagar, Maharashtra. Clients can explore curated packages, customize surprise event blueprints with real-time budget calculations, and book via direct WhatsApp integration and database inquiry tracking. The platform includes a password-protected admin portal for managing packages, media, and site settings.

---

## Live Demo

- **Live Preview:** [vercel](https://movement-craft.vercel.app/)


---

## Features

### Client & User-Facing Features
- **Curated Packages:** Browse signature celebrations (Midnight Doorstep, Proposals, Cinema Takeovers, Cafe Surprises) with transparent pricing, badges, and inclusions.
- **Interactive Blueprint Customizer:** Configure events, select add-ons, view live budget totals, and send structured bookings directly to WhatsApp.
- **Inquiry Persistence:** Form submissions are automatically registered in the backend database prior to opening WhatsApp.
- **Services & Add-Ons Directory:** Filterable catalog of 14+ event categories and special upgrades (cold pyros, dry-ice fog, neon signs, drone shoots).
- **Media Showcase:** High-resolution photo gallery with zoom preview and official brand brochure viewer.
- **Luxury Responsive Design:** Black and gold aesthetic (`#D4AF37`) with editorial serif typography, optimized for mobile, tablet, and desktop.

### Owner & Admin Dashboard Features
- **Secure Authentication:** Protected login with timing-safe credential validation and signed JWT sessions.
- **Package Management:** Full CRUD operations to create, edit, reorder, publish/unpublish drafts, and delete packages (25-package limit).
- **Persistent Media Uploads:** Disk-based image uploads with MIME validation and 10MB limits, saved to server disk.
- **Website Configuration:** Live editing of contact details, social links, and top announcement banner text.
- **Client Inquiries & Lead Manager:** Real-time client inquiry tracking and status management (`New`, `Contacted`, `Confirmed`, `Cancelled`).

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React
- **Backend:** Node.js (v18+), Express.js, TypeScript, TSX
- **Database & Storage:** MongoDB Atlas, Mongoose, Local JSON Fallback Storage
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS
- **Tooling:** Dotenv, npm

---

## Project Structure

```
movement-craft/
├── backend/
│   ├── config/             # DB connection (db.ts) & root .env loader (env.ts)
│   ├── controllers/        # Route controllers (auth, package, inquiry, config, upload)
│   ├── data/               # Seed & fallback package data (packages.json)
│   ├── middleware/         # Auth, validation, and error-handling middleware
│   ├── models/             # Mongoose schemas (Package, Admin, Inquiry, Config, Addon, Service)
│   ├── routes/             # API route endpoints (/api/*)
│   ├── services/           # Authentication & auto-migration services
│   ├── server.ts           # Express server entry point & Vite dev middleware
│   └── test_backend.ts     # 13-point integration test suite
├── frontend/
│   ├── public/             # Static brand assets & uploaded media (/uploads)
│   ├── src/
│   │   ├── components/     # UI components & modals (AdminPanel, Customizer, etc.)
│   │   ├── data/           # Default brand and package definitions (initialData.ts)
│   │   ├── lib/            # API client (api.ts) & storage helpers
│   │   ├── App.tsx         # Main application component
│   │   ├── index.css       # Global luxury theme styles & Tailwind setup
│   │   ├── main.tsx        # React DOM entry point
│   │   └── types.ts        # TypeScript interfaces
│   ├── index.html          # HTML template
│   └── vite.config.ts      # Vite configuration
├── .env                    # Active environment variables
├── .env.example            # Environment template
├── package.json            # Scripts & dependencies
└── README.md               # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment:**
   Create a `.env` file at the root (or copy `.env.example`):
   ```env
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=*
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/movement-craft?retryWrites=true&w=majority"
   JWT_SECRET="your_secure_random_secret"
   ADMIN_PASSWORD="your_secure_admin_password"
   ```
   *(Note: The server automatically falls back to local JSON storage if `MONGODB_URI` is omitted).*

### Available Scripts

- **Development server:**
  ```bash
  npm run dev
  ```
- **Run integration tests:**
  ```bash
  npm test
  ```
- **Type check:**
  ```bash
  npm run lint
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Start production server:**
  ```bash
  npm start
  ```

---

## Author

- **Zarbaksh Khan**
  - GitHub: [Zarbaksh Khan](https://github.com/Zxrbxkhsh)

---

## License

This project was developed as part of a freelance project. The source code and project materials are intended for the client’s use and are not licensed for redistribution or reuse without permission.

