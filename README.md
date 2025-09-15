# 🏬 Store Rating App

A **full-stack web application** where users can register, log in, explore stores, and leave ratings.  
Includes **admin & store owner dashboards** for managing stores and reviews.  

Built with:
- Backend → Node.js, Express.js, MySQL
- Frontend → React (Vite)
- Database ORM → Prisma (optional) / Custom SQL models


 Features
-  User Authentication (Register, Login with JWT)
-  Store Management (CRUD operations for stores)
-  Ratings & Reviews (Rate stores, view ratings, rating stars UI)
   Dashboards:
  - User Dashboard → See ratings & stores
  - Admin Dashboard → Manage users, stores, ratings
  - Store Owner Dashboard → Manage owned stores & feedback
-  Frontend with modern React components
- 🗄 MySQL Database with schema & models

---
 Project Structure
store-rating-app/
├── backend/
│ ├── config/
│ │ └── database.sql # Database schema
│ ├── middleware/
│ │ ├── auth.js # JWT authentication middleware
│ │ └── validation.js # Input validation
│ ├── models/ # Database models
│ │ ├── User.js
│ │ ├── Store.js
│ │ └── Rating.js
│ ├── routes/ # Express routes
│ │ ├── auth.js
│ │ ├── users.js
│ │ ├── stores.js
│ │ └── ratings.js
│ ├── .env # Environment variables
│ ├── server.js # Backend entry
│ └── package.json
│
├── frontend/
│ ├── public/
│ │ ├── components/ # Reusable React components
│ │ │ ├── Navbar.jsx
│ │ │ ├── StoreCard.jsx
│ │ │ └── RatingStars.jsx
│ │ └── pages/ # Application pages
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Stores.jsx
│ │ ├── AdminDashboard.jsx
│ │ └── StoreOwnerDashboard.jsx
│ └── package.json
│
└── README.md


 Installation & Setup

1️⃣ Clone Repository

git clone https://github.com/your-username/store_rating_app.git
cd store_rating_app
2️⃣ Backend Setup
sh
Copy code
cd backend
npm install
Create a .env file in backend/:

env
Copy code
DATABASE_URL="mysql://root:yourpassword@localhost:3306/store_rating_app"

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating_app
JWT_SECRET=your_jwt_secret
PORT=5000
Import SQL schema:

sh
Copy code
mysql -u root -p store_rating_app < config/database.sql
Start backend:

sh
Copy code
node server.js
3️⃣ Frontend Setup
sh
Copy code
cd ../frontend
npm install
npm run dev
Frontend will be available at http://localhost:5173

 API Endpoints
Auth

POST /api/auth/register → Register new user

POST /api/auth/login → Login user

Users

GET /api/users → List all users

Stores

GET /api/stores → List all stores

POST /api/stores → Add store (admin/store owner only)

Ratings

POST /api/ratings/:storeId → Rate a store

GET /api/ratings/:storeId → Get ratings for a store


<img width="1920" height="1140" alt="Screenshot 2025-09-13 194830" src="https://github.com/user-attachments/assets/7ccfd2b9-5ef7-47bc-a6e4-c2eeece1138c" />

<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/c9d3db4e-a980-4e52-acfb-ab552a0e5ff2" />

<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/1ef2c0ef-5c51-47fd-af37-165496fb7a78" />

<img width="1920" height="1140" alt="Screenshot 2025-09-14 210506" src="https://github.com/user-attachments/assets/23a2f63a-c923-4d08-a930-665366624288" />



For Admin sign in:-
gmail:-official@gmail.com
password:-Official123!

for Store sign in:-
gmail:-store@gmail.com
password:-Owner123!

or as per your Database requirements




 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push branch (git push origin feature/amazing-feature)

Open a Pull Request
