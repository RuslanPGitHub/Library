// Database connection
const db = require('../core/db_connect');

class Members {
    // Get all members from the database
    static getAll() {
        const query = `SELECT * FROM members`;
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

    // Get a member by their ID
    static getById(memberId) {
        const query = `
            SELECT * FROM members WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(query, [memberId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add a new member to the database
    static addMember(memberData) {
        const { first_name, last_name, birthdate, address, phone, email } =
            memberData;
        const query = `
            INSERT INTO members (first_name, last_name, birthdate, address, phone, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [first_name, last_name, birthdate, address, phone, email],
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

    // Update member data by their ID
    static updateMember(memberId, memberData) {
        const { first_name, last_name, birthdate, address, phone, email } =
            memberData;
        const query = `
            UPDATE members
            SET first_name = ?, last_name = ?, birthdate = ?, address = ?, phone = ?, email = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [
                    first_name,
                    last_name,
                    birthdate,
                    address,
                    phone,
                    email,
                    memberId,
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

    // Delete a member from the database by ID
    static deleteMember(memberId) {
        const query = 'DELETE FROM members WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(query, [memberId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

// Export the Members class for use in other parts of the application
module.exports = Members;
