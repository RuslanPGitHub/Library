// Importing models
const Books = require('../models/BooksModel');
const Authors = require('../models/AuthorsModel');
const Publishers = require('../models/PublishersModel');

const { PAGINATION } = require('../configs/config');

class BooksController {
    // Method to get all books
    async getBooksHandler(req, res) {
        try {
            // Parameters used for other methods, getting books by filter, similar
            // Current page (obtained from the get method, URL or set as 1)
            const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
            // Number of records per page (obtained from get or set as 10)
            const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            // Offset, needed for range selection from DB
            const offset = (page - 1) * limit;

            // Getting the list of books according to pagination parameters from DB
            const books = await Books.getAll(limit, offset);
            // Counting the number of received books
            const totalBooks = await Books.count('books');
            const totalPages = Math.ceil(totalBooks / limit);

            // Passing parameters to the view
            res.render('books/BooksView', {
                books,
                filter: 'All books',
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get data about a specific book
    async getSingleBookHandler(req, res) {
        try {
            const bookId = req.params.bookId;
            const book = await Books.getById(bookId);
            res.render('books/BookView', { book });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get a list of books sorted by author
    async getBooksByAuthorHandler(req, res) {
        try {
            const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
            const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            const offset = (page - 1) * limit;

            const authorId = req.params.authorId;
            const books = await Books.getByAuthorId(authorId, limit, offset);
            const totalBooks = await Books.count('books WHERE author_id = ?', [
                authorId,
            ]);
            const totalPages = Math.ceil(totalBooks / limit);

            res.render('books/BooksView', {
                books,
                filter: 'Author - ' + books[0].author_fullname,
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get a list of books sorted by publication year
    async getBooksByPubYearHandler(req, res) {
        try {
            const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
            const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            const offset = (page - 1) * limit;

            const pubYear = req.params.pubYear;
            const books = await Books.getByPubYear(pubYear, limit, offset);

            // Here the count method is passed part of the DB query to get the number of records by filter
            // for other similar methods the same parameters
            const totalBooks = await Books.count('books WHERE year = ?', [
                pubYear,
            ]);
            const totalPages = Math.ceil(totalBooks / limit);

            res.render('books/BooksView', {
                books,
                filter: 'Publication year - ' + books[0].year,
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get a list of books sorted by publisher
    async getBooksByPublisherIdHandler(req, res) {
        try {
            const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
            const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            const offset = (page - 1) * limit;

            const publisherId = req.params.publisherId;
            const books = await Books.getByPublisherId(
                publisherId,
                limit,
                offset
            );
            const totalBooks = await Books.count(
                'books WHERE publisher_id = ?',
                [publisherId]
            );
            const totalPages = Math.ceil(totalBooks / limit);

            res.render('books/BooksView', {
                books,
                filter: 'Publisher - ' + books[0].publisher_name,
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get a list of books sorted by genre
    async getBooksByGenreHandler(req, res) {
        try {
            const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
            const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
            const offset = (page - 1) * limit;

            const genre = req.params.genre;
            const books = await Books.getByGenre(genre, limit, offset);
            const totalBooks = await Books.count('books WHERE genre = ?', [
                genre,
            ]);
            const totalPages = Math.ceil(totalBooks / limit);

            res.render('books/BooksView', {
                books,
                filter: 'Genre -' + genre,
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form for adding a book, gets data of authors and publishers to form selects
    async getBookAddHandler(req, res) {
        try {
            const authors = await Authors.getAll();
            const publishers = await Publishers.getAll();
            res.render('books/BookAddView', { authors, publishers });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to add a book
    async postBookAddHandler(req, res) {
        try {
            const authors = await Authors.getAll();
            const publishers = await Publishers.getAll();
            const lastID = await Books.addBook(req.body);
            res.render('books/BookAddView', { authors, publishers, lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form for updating a book
    async getBookUpdateHandler(req, res) {
        try {
            const authors = await Authors.getAll();
            const publishers = await Publishers.getAll();
            const bookId = req.params.bookId;
            const book = await Books.getById(bookId);
            res.render('books/BookUpdateView', { authors, publishers, book });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to update a book
    async postBookUpdateHandler(req, res) {
        try {
            const bookId = req.params.bookId;
            const bookData = req.body;
            const result = await Books.updateBook(bookId, bookData);

            if (result.updated) {
                res.redirect('/books/' + bookId);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to delete a book
    async deleteBookHandler(req, res) {
        const bookId = req.params.bookId;
        try {
            const result = await Books.deleteBook(bookId);
            if (result.deleted) {
                res.status(200).json({
                    message: 'Book deleted successfully',
                });
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Exporting the controller class
module.exports = new BooksController();
