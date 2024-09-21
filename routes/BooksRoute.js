// Importing the Express module
const express = require('express');

// Creating an Express Router object
const router = express.Router();

// Importing the controller for books
const BooksController = require('../controllers/BooksController');

// Route to get all books
router.get('/', BooksController.getBooksHandler);

// Route to display the form for adding a new book
router.get('/add/', BooksController.getBookAddHandler);

// Route to handle the addition of a new book
router.post('/add/', BooksController.postBookAddHandler);

// Route to get a single book by its ID
router.get('/:bookId/', BooksController.getSingleBookHandler);

// Route to display the form for updating a book
router.get('/update/:bookId', BooksController.getBookUpdateHandler);

// Route to handle the update of a book
router.post('/update/:bookId', BooksController.postBookUpdateHandler);

// Route to get books by author ID
router.get('/author/:authorId/', BooksController.getBooksByAuthorHandler);

// Route to get books by publisher ID
router.get('/publisher/:publisherId/', BooksController.getBooksByPublisherIdHandler);

// Route to get books by publication year
router.get('/pubyear/:pubYear/', BooksController.getBooksByPubYearHandler);

// Route to get books by genre
router.get('/genre/:genre/', BooksController.getBooksByGenreHandler);

// Route to delete a book by its ID
router.delete('/delete/:bookId', BooksController.deleteBookHandler);

// Exporting the router for use in other parts of the application
module.exports = router;
