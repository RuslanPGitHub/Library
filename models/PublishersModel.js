// Database connection
const db = require('../core/db_connect');

class Publishers {
    // Get all publishers from the database
    static getAll() {
        const query = `SELECT * FROM publishers`;
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

    // Get a publisher by their ID
    static getById(publisherId) {
        const query = `
                SELECT * FROM publishers WHERE id = ?
            `;
        return new Promise((resolve, reject) => {
            db.all(query, [publisherId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add a new publisher to the database
    static addPublisher(publisherData) {
        const { name, address, phone, website } = publisherData;
        const query = `
            INSERT INTO publishers (name, address, phone, website)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(query, [name, address, phone, website], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // Update publisher data by their ID
    static updatePublisher(publisherId, publisherData) {
        const { name, address, phone, website } = publisherData;
        const query = `
            UPDATE publishers
            SET name = ?, address = ?, phone = ?, website = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [name, address, phone, website, publisherId],
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

    // Delete a publisher by their ID
    static deletePublisher(publisherId) {
        const query = 'DELETE FROM publishers WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(query, [publisherId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

// Export the Publishers class for use in other parts of the application
module.exports = Publishers;
