// Importing the Express module
const express = require('express');

// Creating an Express router object
const router = express.Router();

// Importing the MembersController
const MembersController = require('../controllers/MembersController');

// Route for getting all members
router.get('/', MembersController.getMembersHandler);

// Route for displaying the form to add a new member
router.get('/add/', MembersController.getMemberAddHandler);

// Route for handling the addition of a new member
router.post('/add/', MembersController.postMemberAddHandler);

// Route for displaying the form to update a member
router.get('/update/:memberId', MembersController.getMemberUpdateHandler);

// Route for handling the update of a member
router.post('/update/:memberId', MembersController.postMemberUpdateHandler);

// Route for deleting a member by their ID
router.delete('/delete/:memberId', MembersController.deleteMemberHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
