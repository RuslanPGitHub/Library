// Database connection and Paginator class
const db = require('../core/db_connect');
const Paginator = require('../core/Paginator');

const paginator = new Paginator(db);

class Books {
    // Get all books with pagination (limit and offset)
    static getAll(limit, offset) {
        const query = `
                SELECT 
                    books.*, 
                    CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                    publishers.name AS publisher_name
                FROM 
                    books
                JOIN 
                    authors ON books.author_id = authors.id
                JOIN 
                    publishers ON books.publisher_id = publishers.id
            `;
        return paginator.getPaginatedResults(query, [], limit, offset);
    }

    // Count the number of records for a specific query
    static count(query, params) {
        return paginator.countResults(query, params);
    }

    // Get a book by its ID
    static getById(bookId) {
        if (isNaN(bookId)) {
            return Promise.reject(new Error('Invalid book ID.'));
        }

        const query = `
            SELECT 
                books.*, 
                CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                publishers.name AS publisher_name
            FROM 
                books
            JOIN 
                authors ON books.author_id = authors.id
            JOIN 
                publishers ON books.publisher_id = publishers.id
            WHERE 
                books.id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(query, [bookId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get books by author ID with pagination (limit and offset)
    static getByAuthorId(authorId, limit, offset) {
        const query = `
            SELECT 
                books.*, 
                CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                publishers.name AS publisher_name
            FROM 
                books
            JOIN 
                authors ON books.author_id = authors.id
            JOIN 
                publishers ON books.publisher_id = publishers.id
            WHERE 
                authors.id = ?
        `;
        return paginator.getPaginatedResults(query, [authorId], limit, offset);
    }

    // Get books by publication year with pagination (limit and offset)
    static getByPubYear(pubYear, limit, offset) {
        const query = `
            SELECT 
                books.*, 
                CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                publishers.name AS publisher_name
            FROM 
                books
            JOIN 
                authors ON books.author_id = authors.id
            JOIN 
                publishers ON books.publisher_id = publishers.id
            WHERE 
                books.year = ?
        `;
        return paginator.getPaginatedResults(query, [pubYear], limit, offset);
    }

    // Get books by publisher ID with pagination (limit and offset)
    static getByPublisherId(publisherId, limit, offset) {
        const query = `
            SELECT 
                books.*, 
                CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                publishers.name AS publisher_name
            FROM 
                books
            JOIN 
                authors ON books.author_id = authors.id
            JOIN 
                publishers ON books.publisher_id = publishers.id
            WHERE 
                publishers.id = ?
        `;
        return paginator.getPaginatedResults(
            query,
            [publisherId],
            limit,
            offset
        );
    }

    // Get books by genre with pagination (limit and offset)
    static getByGenre(genre, limit, offset) {
        const query = `
            SELECT 
                books.*, 
                CONCAT(authors.first_name, ' ', authors.last_name) AS author_fullname,
                publishers.name AS publisher_name
            FROM 
                books
            JOIN 
                authors ON books.author_id = authors.id
            JOIN 
                publishers ON books.publisher_id = publishers.id
            WHERE 
                books.genre = ?
        `;
        return paginator.getPaginatedResults(query, [genre], limit, offset);
    }

    // Add a new book to the database
    static addBook(bookData) {
        const { title, author, publisher, year, isbn, genre, description } =
            bookData;

        // Data validation
        if (!title || !author || !publisher || !year || !isbn || !genre) {
            return Promise.reject(new Error('All fields are required.'));
        }

        if (typeof title !== 'string' || title.trim() === '') {
            return Promise.reject(new Error('Invalid title.'));
        }

        if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
            return Promise.reject(new Error('Invalid year.'));
        }

        if (!/^\d{13}$/.test(isbn)) {
            return Promise.reject(new Error('Invalid ISBN.'));
        }

        const query = `
            INSERT INTO books (title, author_id, publisher_id, year, isbn, genre, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [title, author, publisher, year, isbn, genre, description],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    // Update book data by its ID
    static updateBook(bookId, bookData) {
        const { title, author, publisher, year, isbn, genre, description } =
            bookData;

        // Data validation
        if (!title || !author || !publisher || !year || !isbn || !genre) {
            return Promise.reject(new Error('All fields are required.'));
        }

        if (typeof title !== 'string' || title.trim() === '') {
            return Promise.reject(new Error('Invalid title.'));
        }

        if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
            return Promise.reject(new Error('Invalid year.'));
        }

        if (!/^\d{13}$/.test(isbn)) {
            return Promise.reject(new Error('Invalid ISBN.'));
        }

        const query = `
            UPDATE books
            SET title = ?, author_id = ?, publisher_id = ?, year = ?, isbn = ?, genre = ?, description = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [
                    title,
                    author,
                    publisher,
                    parseInt(year),
                    isbn,
                    genre,
                    description,
                    bookId,
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ updated: this.changes });
                    }
                }
            );
        });
    }

    // Delete a book by its ID
    static deleteBook(bookId) {
        // Check, if bookId is numeric
        if (isNaN(bookId)) {
            return Promise.reject(new Error('Invalid book ID.'));
        }

        const query = 'DELETE FROM books WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(query, [bookId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

// Export the Books class for use in other parts of the application
module.exports = Books;
