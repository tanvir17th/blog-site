# BlogSpace - Full-Stack Blog Management System

BlogSpace is a modern, responsive full-stack blog application featuring user authentication, role-based access control (User/Admin), dynamic blog CRUD operations, and customized profile management with file uploads.

**Author:** Md Tanvir Ahamed

---

## Table of Contents
- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Technologies Used](#technologies-used)
- [Backend Dependency](#backend-dependency)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [How to Run the Application](#how-to-run-the-application)
- [Application Routes](#application-routes)
- [User/Admin Functionality](#useradmin-functionality)
- [Screenshots](#screenshots)

---

## Project Overview

BlogSpace is built using a decoupled architecture:
- **Frontend:** Next.js (App Router), React Context API, Tailwind CSS, and Axios.
- **Backend:** Express REST API server connected to a MySQL relational database with standard JWT authentication and static file handling for profile pictures via Multer.

---

## Main Features

- 🔐 **Authentication & Authorization**: Secure JWT-based registration, login, and password reset.
- 👥 **Role-Based Access Control**: Separate privileges for standard **Users** and **Admins**.
- 📝 **Blog Management**: Full Create, Read, Update, and Delete (CRUD) operations for blog posts.
- 🖼️ **Profile Management**: Personal details updates and avatar picture uploads using Multer.
- ⚡ **Persistent Session Management**: Global state hydration with Next.js Client Context.
- 🛡️ **Secure Password Hashing**: `bcryptjs` encryption for database security.

---

## Technologies Used

### Frontend (`blog-app`)
- **Framework**: Next.js 14 / React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios

### Backend (`blog-backend`)
- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js
- **Database**: MySQL2 (with Promise Pool)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File Uploads**: `multer`

---

## Backend Dependency

Before running the backend, make sure you have the following prerequisites installed on your system:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MySQL Server** (Running locally on port `3306` or via remote connection)
- **DBeaver** or **MySQL Workbench** (Optional, for database management)

---

## Environment Variables

Create a `.env` file inside the `blog-backend` directory with the following variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_db
JWT_SECRET=your_jwt_secret_key
```

*(Optional)* Create a `.env.local` file inside the `blog-app` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blog-site.git
   cd blog-site
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd blog-backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../blog-app
   npm install
   ```

---

## How to Run the Application

You must run the backend and frontend in two separate terminal windows.

### Terminal 1: Backend Server (`blog-backend`)
```bash
cd blog-backend
node server.js
```
> Running on `http://localhost:5000`

### Terminal 2: Frontend App (`blog-app`)
```bash
cd blog-app
npm run dev
```
> Running on `http://localhost:3000`

---

## Application Routes

### Frontend Routes (`blog-app`)

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Homepage displaying published blogs |
| `/login` | Public | User & Admin login page |
| `/register` | Public | Account registration page |
| `/forgot-password` | Public | Password recovery form |
| `/dashboard` | Protected | User/Admin dashboard overview |
| `/dashboard/blogs` | Protected | Manage user's created blogs |
| `/dashboard/blogs/create` | Protected | Form to write a new blog |
| `/dashboard/profile` | Protected | Update profile details and upload avatar |
| `/dashboard/users` | Admin Only | User management table for Admins |

### Backend API Routes (`blog-backend`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new account |
| `POST` | `/api/auth/login` | No | Authenticate user & issue JWT |
| `GET` | `/api/users/profile` | Yes | Get logged-in user profile |
| `PUT` | `/api/users/profile` | Yes | Update first and last name |
| `POST` | `/api/users/profile/image`| Yes | Upload profile avatar |
| `GET` | `/api/blogs` | No | Fetch all blog posts |
| `POST` | `/api/blogs` | Yes | Create a new blog post |
| `PUT` | `/api/blogs/:id` | Yes | Update an existing blog |
| `DELETE`| `/api/blogs/:id` | Yes | Delete a blog post |

---

## User/Admin Functionality

### 👤 Standard User
- Register a new account and log in.
- View all public blog posts.
- Create, edit, and delete their own blog posts.
- Update personal details (First Name, Last Name).
- Upload and persist a custom profile image.

### 🛡️ Admin User
- Full access to standard user capabilities.
- Access to the `/dashboard/users` route.
- Manage user account statuses (Active / Deactivated).
- Delete or moderate any blog post across the platform.

---

## Screenshots

Click the link below to access the full project screenshots and visual walkthrough:

🔗 **[View Project Screenshots on Google Drive](https://drive.google.com/drive/folders/1trurMVDktVp3NMra6DcSDbdg3gdeO7Yj?usp=sharing)**

## Author

**MD. Tanvir Ahamed**