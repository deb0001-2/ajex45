const { MongoClient } = require('mongodb');

// This is the URL to connect to your MongoDB database.
// In a real app, this should come from your .env file like: process.env.MONGO_URI
const url = 'mongodb://localhost:27017'; 
const dbName = 'hms_database';

let db; // This variable will hold our database connection

async function connectToDatabase() {
    try {
        // 1. Create a new client
        const client = new MongoClient(url);

        // 2. Connect to the MongoDB server
        await client.connect();
        console.log('Successfully connected to MongoDB!');

        // 3. Select the specific database you want to use
        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        // Stop the application if it cannot connect to the database
        process.exit(1); 
    }
}

// Function to get the database connection whenever we need it
function getDatabase() {
    if (!db) {
        throw new Error('Database not connected! Call connectToDatabase() first.');
    }
    return db;
}

module.exports = {
    connectToDatabase,
    getDatabase
};
