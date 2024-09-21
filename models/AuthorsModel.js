// Database connection
const db = require('../core/db_connect');

class Authors {
    // Get all authors from the database
    static getAll() {
        const query = `SELECT * FROM authors`;
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get an author by their ID
    static getById(authorId) {
        const query = `
            SELECT * FROM authors WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(query, [authorId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add a new author to the database
    static addAuthor(authorData) {
        const { first_name, last_name, birthdate, biography } = authorData;
        const query = `
            INSERT INTO authors (first_name, last_name, birthdate, biography)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [first_name, last_name, birthdate, biography],
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

    // Update author data by their ID
    static updateAuthor(authorId, authorData) {
        const { first_name, last_name, birthdate, biography } = authorData;
        const query = `
            UPDATE authors
            SET first_name = ?, last_name = ?, birthdate = ?, biography = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [first_name, last_name, birthdate, biography, authorId],
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

    // Delete an author from the database by ID
    static deleteAuthor(authorId) {
        const query = 'DELETE FROM authors WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(query, [authorId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

// Export the Authors class for use in other parts of the application
module.exports = Authors;
