// Database connection and Paginator class
const db = require('../core/db_connect');
const Paginator = require('../core/Paginator');

const paginator = new Paginator(db);

class Loans {
    // Get all loans with pagination (limit and offset)
    static getAll(limit, offset) {
        const query = `
            SELECT 
                loans.*, 
                books.title AS book_title,
                CONCAT(members.first_name, ' ', members.last_name) AS member_fullname
            FROM 
                loans
            JOIN 
                books ON loans.book_id = books.id
            JOIN 
                members ON loans.member_id = members.id
            ORDER BY id DESC
        `;
        return paginator.getPaginatedResults(query, [], limit, offset);
    }


    // Get a loan by their ID
    static getById(loanId) {
        const query = `
            SELECT * FROM loans WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(query, [loanId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Count the number of records for a specific query
    static count(query, params) {
        return paginator.countResults(query, params);
    }

    // Add a new loan to the database
    static addLoan(LoanData) {
        const { book_id, member_id, loan_date, status } = LoanData;
        const query = `
            INSERT INTO loans (book_id, member_id, loan_date, status)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [book_id, member_id, loan_date, status],
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

    // Update loan data by their ID
    static updateLoan(loanId, loanData) {
        const { return_date, status } = loanData;
        const query = `
            UPDATE loans
            SET return_date = ?, status = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(
                query,
                [return_date, status, loanId],
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

    // Delete a loan from the database by ID
    static deleteLoan(loanId) {
        const query = 'DELETE FROM loans WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(query, [loanId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

// Export the Loans class for use in other parts of the application
module.exports = Loans;
