FinData Systems

This project is a high-performance **Full-Stack Finance Data Processing and Access Control System** . It demonstrates robust backend architecture, role-based access control (RBAC), and financial analytics data processing.

---

Core Philosophy: Backend-First
This is a **Backend-First** assignment. The backend is the source of truth, managing:
- Complex financial calculations and data aggregation.
- Strict Role-Based Access Control (RBAC) via middleware.
- Input validation using Zod.
- Persistent storage with Prisma and SQLite.

The frontend is a **lightweight demo layer** designed specifically to showcase the backend's API capabilities, security protocols, and real-time data processing.

---

Technology Stack

### Backend
- **Node.js + Express**: Core application framework.
- **TypeScript**: Ensuring type safety throughout the data flow.
- **Prisma ORM**: Modern database access layer for SQLite.
- **SQLite**: Local relational database for easy portability.
- **Zod**: Robust request and data validation.
- **Morgan/CORS**: Industry-standard middleware for logging and cross-origin security.

### Frontend
- **React + Vite**: High-performance UI framework and build tool.
- **Tailwind CSS**: Modern styling for a premium, professional dashboard look.
- **Recharts**: Advanced data visualization for finance trends.
- **Axios**: Standard HTTP client with interceptors for auth headers.
- **Lucide React**: Clean, consistent iconography.

---

Role-Based Access Control (RBAC)
The system implements a transparent RBAC model using `x-user-id` mock authentication:

| Role | Financial Dashboard | Records Management | User Management | Advanced Analytics |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** (u1) | Full Access | Full CRUD (Add/Edit/Del) | Full Management | Full Access |
| **Analyst** (u2) | Full Access | Read-Only | Read-Only | Full Access |
| **Viewer** (u3) | Summary Only | Read-Only | **NO ACCESS** | **NO ACCESS** |

---

Feature Highlights

Financial Processing
- **Summary API**: Aggregates Income, Expenses, and Net Balance in real-time.
- **Time-Series Trends**: Backend-grouped monthly data for charting.
- **Category Breakdown**: Dynamic categorization of financial records.
- **Soft Deletes**: Critical finance protection; records are flagged, not permanently removed.

User & Identity
- **Mock Header Auth**: All requests automatically attach `x-user-id` from the global context.
- **Identity Switcher**: Interactive selector in the UI to instantly experience the project from different role perspectives.
- **Activity Logging**: (Extensible) audit log models included in the schema.

---

Setup Instructions

### 1. Backend Prep
```bash
cd backend
npm install
npx prisma db push --accept-data-loss
npx prisma generate
npm run seed
npm run dev
```

### 2. Frontend Prep
```bash
cd frontend
npm install
npm run dev
```

### 3. Verification
- Open [http://localhost:5173/](http://localhost:5173/)
- The dashboard should load immediately with the **Admin** role selected.
- Use the **Demo User Selector** in the header to jump between roles (Admin, Analyst, Viewer).

---

## 📝 API Reference (Core Endpoints)

- `GET /api/health`: System heartbeat and DB status.
- `GET /api/auth/me`: Validates and returns current session info.
- `GET /api/analytics/summary`: Data for the top cards.
- `GET /api/records`: Full record list with filtering support.
- `POST /api/users`: Admin-only user creation.

---

Assumptions & Tradeoffs
- **Mock Auth**: Used `x-user-id` instead of JWT for reviewer speed and ease of role-switching.
- **Local DB**: SQLite chosen for zero-config reproducibility on external systems.
- **UI Focus**: Visuals are polished but secondary to demonstrating API data integrity and RBAC logic.

---

Future Improvements
- **JWT Authentication**: Full passport/bcrypt session management.
- **Auditing**: Completing the AuditLog service implementation.
- **Pagination**: Scaling the Records table with server-side paging.
- **Unit Testing**: 100% logic coverage for record mutation services.

---

