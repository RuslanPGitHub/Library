// Importing the Express module
const express = require('express');

// Importing the getRootHandler method from the RootController
const { getRootHandler } = require('../controllers/RootController');

// Creating an Express router object
const router = express.Router();

// Route for handling GET requests to the root path ('/')
router.get('/', getRootHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
