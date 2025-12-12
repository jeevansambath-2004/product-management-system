# Product Management System

A full-stack web application for inventory and product management with user authentication, built with React, Express.js, and MongoDB.

## Features

- **User Authentication**: Register and login functionality with JWT tokens
- **Product Management**: Add, edit, and delete products from inventory
- **Responsive Design**: Beautiful Bootstrap-based UI with interactive components
- **Real-time Updates**: Instant inventory updates using Axios
- **Security**: JWT-based authentication for API endpoints

## Tech Stack

### Frontend
- React 19.2.0
- Vite
- Bootstrap 5.3.0
- Axios for HTTP requests
- CSS3 with gradients and animations

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- RESTful API

## Project Structure

```
product management project/
├── Backend/
│   ├── index.js          # Main server file
│   ├── models/
│   │   ├── user.js       # User model
│   │   └── item.js       # Product/Item model
│   └── package.json
├── Frontend/
│   └── product-management-system/
│       ├── src/
│       │   ├── App.jsx   # Main React component
│       │   ├── index.css # Global styles
│       │   └── main.jsx  # Entry point
│       ├── index.html
│       └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or with nodemon for development
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend/product-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Products
- `GET /api/items` - Fetch all products
- `POST /api/items` - Add a new product
- `PUT /api/items/:id` - Update a product
- `DELETE /api/items/:id` - Delete a product

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Use your credentials to log in
3. **Add Products**: Enter product details (name, quantity, price) and click Add
4. **Edit Products**: Click Edit on any product to modify its details
5. **Delete Products**: Click Delete to remove products from inventory
6. **Logout**: Click Logout to exit

## Features in Detail

### Interactive UI
- Gradient backgrounds with glass-morphism effects
- Smooth animations and transitions
- Hover effects on buttons and cards
- Responsive Bootstrap grid layout

### Edit Functionality
- Inline editing directly in the table
- Real-time form validation
- Save and Cancel options for editing
- Confirmation dialog before deletion

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.
