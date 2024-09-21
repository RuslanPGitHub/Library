// Importing the Express module
const express = require('express');

// Creating an Express router object
const router = express.Router();

// Importing the LoansController
const LoansController = require('../controllers/LoansController');

// Route for getting all loans
router.get('/', LoansController.getLoansHandler);

// Route for displaying the form to add a new loan
router.get('/add', LoansController.getLoansAddHandler);

// Route to handle the addition of a new loan
router.post('/add/', LoansController.postLoanAddHandler);

// Route to display the form for updating a loan
router.get('/update/:loanId', LoansController.getLoanUpdateHandler);

// Route to handle the update of a loan
router.post('/update/:loanId', LoansController.postLoanUpdateHandler);

// Route to delete a loan by their ID
router.delete('/delete/:loanId', LoansController.deleteLoanHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
