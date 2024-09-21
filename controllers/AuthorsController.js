// Importing the Authors model
const Authors = require('../models/AuthorsModel');

class AuthorsController {
    // Get all authors
    async getAuthorsHandler(req, res) {
        try {
            const authors = await Authors.getAll();

            // Array of images for authors in the test data
            const files = [
                'man-user-circle-icon.svg',
                'woman-user-circle-icon.svg',
            ];

            // Function to randomly select an image for the author from the array above
            function getRandomElement(arr) {
                const randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            }

            authors.forEach((author) => {
                author.randomImage = getRandomElement(files);
            });

            res.render('authors/AuthorsView', { authors });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get the view with the form for adding authors
    async getAuthorAddHandler(req, res) {
        try {
            res.render('authors/AuthorAddView');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for adding an author
    async postAuthorAddHandler(req, res) {
        try {
            const lastID = await Authors.addAuthor(req.body);
            res.render('authors/AuthorAddView', { lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get the view with the form for updating an author
    async getAuthorUpdateHandler(req, res) {
        try {
            const authorId = req.params.authorId;
            const author = await Authors.getById(authorId);
            res.render('authors/AuthorUpdateView', { author });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for updating an author
    async postAuthorUpdateHandler(req, res) {
        try {
            const authorId = req.params.authorId;
            const authorData = req.body;
            const result = await Authors.updateAuthor(authorId, authorData);

            if (result.updated) {
                res.redirect('/authors/');
            } else {
                res.status(404).json({ message: 'Author not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for deleting an author
    async deleteAuthorHandler(req, res) {
        const authorId = req.params.authorId;
        try {
            const result = await Authors.deleteAuthor(authorId);
            if (result.deleted) {
                res.status(200).json({
                    message: 'Author deleted successfully',
                });
            } else {
                res.status(404).json({ message: 'Author not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Exporting the controller class
module.exports = new AuthorsController();
