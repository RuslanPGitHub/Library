// Import the sqlite3 module and enable verbose mode for detailed error messages
const sqlite3 = require('sqlite3').verbose();

// Define the path to the database file
const dbPath = './library.sqlite';

// Create a new sqlite3 database object and open a connection to the database
const db = new sqlite3.Database(dbPath, (err) => {
    // Check for errors when opening the database
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database opened successfully');
    }
});

// Export the database object for use in other parts of the application
module.exports = db;
