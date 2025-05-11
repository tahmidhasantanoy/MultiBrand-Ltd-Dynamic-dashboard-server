# Dynamic Dashboard Server

This is the backend server for the Dynamic Dashboard project, built with Node.js and Express. It provides API endpoints for interacting with the frontend and handles authentication, MongoDB interactions, and more.

## Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v18.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (if running locally)
- [Git](https://git-scm.com/) (optional for version control)

## Setting up the Server Locally

### Step 1: Clone the repository

First, clone the repository to your local machine:

```bash
https://github.com/tahmidhasantanoy/MultiBrand-Ltd-Dynamic-dashboard-server
```

### Step 2: Install dependencies

Navigate to the server folder:

```bash
cd dynamic-dashboard-server
```

Then, install the necessary dependencies:

```bash
npm install
```

### Step 3: Set up environment variables

Create a .env file in the root of your project and add the following:

```bash
MONGODB_URI=mongodb+srv://Dynamic_dashboard:HkCHPIyEJtzWbrwh@cluster0.oc9fgut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=dynamic-multibrand
```

Replace your-mongodb-connection-string with your MongoDB URI.
Replace your-jwt-secret with a secure secret for JWT authentication.

### Step 4: Start the server

To start the server in development mode with automatic restarts (using nodemon), run:

```bash
npm start
```

The server will be available at http://localhost:5000.

# Dynamic Dashboard Server

This is the backend server for the Dynamic Dashboard project, built with Node.js and Express. It provides API endpoints for interacting with the frontend and handles authentication, MongoDB interactions, and more.

## Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v18.x or later)
- MongoDB (if running locally)
- Git (optional for version control)
