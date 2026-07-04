require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors()); // Allows your frontend to communicate with your backend
app.use(express.json()); // Allows your server to accept JSON data in requests

// A simple test route
app.get('/', (req, res) => {
    res.send('API is running properly!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
