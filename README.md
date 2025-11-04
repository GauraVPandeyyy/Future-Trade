# Future Trade Platform

A full-stack trading and investment platform with user authentication, dashboard analytics, and investment management features.

## 🌟 Features

### Authentication & Security
- Secure user registration and login system
- Cookie-based authentication
- Protected routes
- Password encryption
- KYC verification system

### Dashboard & Analytics
- Real-time investment tracking
- Transaction history
- Performance analytics
- Team structure visualization
- Wallet management

### Investment Features
- Multiple investment packages
- Re-investment options
- Bonus and cashback system
- Salary management
- ROI tracking

### User Profile Management
- Profile customization
- Bank details management
- Password change functionality
- KYC document upload
- Team tree visualization

## 🚀 Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- Lucide React for icons
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cookie-parser for cookie management

## 📦 Project Structure

```
├── backend(auth)/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── server.js
│
└── frontend(User-Dashboard)/
    ├── src/
    │   ├── Auth/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    └── index.html
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend(auth)
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend(User-Dashboard)
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/gaurav_login` - User login
- POST `/api/auth/change-password` - Change password

### User Management
- GET `/api/auth/user/:userId` - Get user details
- POST `/api/auth/update-profile` - Update user profile
- POST `/api/auth/add-bank-details` - Add bank details

### Investment & Transactions
- GET `/api/auth/investment-summary/:userId` - Get investment summary
- GET `/api/auth/user/transactionHistory/:userId` - Get transaction history
- GET `/api/auth/products` - Get investment packages
- POST `/api/auth/invest` - Make investment

### Team & Downline
- GET `/api/auth/downline/:userId` - Get team structure
- GET `/api/auth/user-dashboard/:userId` - Get dashboard data

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Protected API routes
- CORS configuration
- Cookie-based session management
- Input validation and sanitization

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, please reach out to the project maintainers or create an issue in the repository.