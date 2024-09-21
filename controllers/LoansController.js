// Importing models
const Loans = require('../models/LoansModel');
const Members = require('../models/MembersModel');
const Books = require('../models/BooksModel');

class LoansController {
    // Method to get all loans
    async getLoansHandler(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const loans = await Loans.getAll(limit, offset);
            const totalLoans = await Loans.count('loans');
            const totalPages = Math.ceil(totalLoans / limit);

            // Passing parameters to the view
            res.render('loans/LoansView', {
                loans,
                page,
                totalPages,
                limit,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form for adding a loan, gets data of members and books
    async getLoansAddHandler(req, res) {
        try {
            const members = await Members.getAll();
            const books = await Books.getAll();

            res.render('loans/LoanAddView', { members, books });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to add a loan
    async postLoanAddHandler(req, res) {
        try {
            const members = await Members.getAll();
            const books = await Books.getAll();
            const lastID = await Loans.addLoan(req.body);
            res.render('loans/LoanAddView', { members, books, lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get the view with the form for updating an loan
    async getLoanUpdateHandler(req, res) {
        try {
            const loanId = req.params.loanId;
            const loan = await Loans.getById(loanId);
            res.render('loans/LoanUpdateView', { loan });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for updating a loan
    async postLoanUpdateHandler(req, res) {
        try {
            const loanId = req.params.loanId;
            const loanData = req.body;
            const result = await Loans.updateLoan(loanId, loanData);

            if (result.updated) {
                res.redirect('/loans/');
            } else {
                res.status(404).json({ message: 'Loan not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for deleting a loan
    async deleteLoanHandler(req, res) {
        const loanId = req.params.loanId;
        try {
            const result = await Loans.deleteLoan(loanId);
            if (result.deleted) {
                res.status(200).json({
                    message: 'Loan deleted successfully',
                });
            } else {
                res.status(404).json({ message: 'Loan not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Exporting the controller class
module.exports = new LoansController();
