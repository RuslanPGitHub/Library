// Importing the Express module
const express = require('express');

// Importing routers for root, books, authors, publishers, members, and loans
const rootRouter = require('./RootRoute');
const booksRouter = require('./BooksRoute');
const authorsRouter = require('./AuthorsRoute');
const publishersRouter = require('./PublishersRoute');
const membersRouter = require('./MembersRoute');
const loansRouter = require('./LoansRoute');

// Creating an Express router object
const router = express.Router();

// Using the root router for the root path
router.use('/', rootRouter);

// Using the books router for the '/books' path
router.use('/books', booksRouter);

// Using the authors router for the '/authors' path
router.use('/authors', authorsRouter);

// Using the publishers router for the '/publishers' path
router.use('/publishers', publishersRouter);

// Using the members router for the '/members' path
router.use('/members', membersRouter);

// Using the loans router for the '/loans' path
router.use('/loans', loansRouter);

// Exporting the router for use in other parts of the application
module.exports = router;
