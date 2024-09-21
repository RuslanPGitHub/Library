// Importing the Express module
const express = require('express');

// Creating an Express router object
const router = express.Router();

// Importing the PublishersController
const PublishersController = require('../controllers/PublishersController');

// Route for getting all publishers
router.get('/', PublishersController.getPublishersHandler);

// Route for displaying the form to add a new publisher
router.get('/add/', PublishersController.getPublisherAddHandler);

// Route for displaying the form to update a publisher
router.get('/update/:publisherId', PublishersController.getPublisherUpdateHandler);

// Route for handling the update of a publisher
router.post('/update/:publisherId', PublishersController.postPublisherUpdateHandler);

// Route for handling the addition of a new publisher
router.post('/add/', PublishersController.postPublisherAddHandler);

// Route for deleting a publisher by their ID
router.delete('/delete/:publisherId', PublishersController.deletePublisherHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
