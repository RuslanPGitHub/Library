// Importing the Express module
const express = require('express');

// Creating an Express Router object
const router = express.Router();

// Importing the controller for authors
const AuthorsController = require('../controllers/AuthorsController');

// Route to get all authors
router.get('/', AuthorsController.getAuthorsHandler);

// Route to display the form for adding a new author
router.get('/add/', AuthorsController.getAuthorAddHandler);

// Route to handle the addition of a new author
router.post('/add/', AuthorsController.postAuthorAddHandler);

// Route to display the form for updating an author
router.get('/update/:authorId', AuthorsController.getAuthorUpdateHandler);

// Route to handle the update of an author
router.post('/update/:authorId', AuthorsController.postAuthorUpdateHandler);

// Route to delete an author by their ID
router.delete('/delete/:authorId', AuthorsController.deleteAuthorHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
