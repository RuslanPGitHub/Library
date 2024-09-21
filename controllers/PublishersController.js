// Import the model
const Publishers = require('../models/PublishersModel');

class PublishersController {
    // Get all publishers
    async getPublishersHandler(req, res) {
        try {
            const publishers = await Publishers.getAll();

            res.render('publishers/PublishersView', { publishers });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form to add publishers
    async getPublisherAddHandler(req, res) {
        try {
            res.render('publishers/PublisherAddView');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to add publishers
    async postPublisherAddHandler(req, res) {
        try {
            const lastID = await Publishers.addPublisher(req.body);
            res.render('publishers/PublisherAddView', { lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form to update a publisher
    async getPublisherUpdateHandler(req, res) {
        try {
            const publisherId = req.params.publisherId;
            const publisher = await Publishers.getById(publisherId);
            res.render('publishers/PublisherUpdateView', { publisher });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to update a publisher
    async postPublisherUpdateHandler(req, res) {
        try {
            const publisherId = req.params.publisherId;
            const publisherData = req.body;
            const result = await Publishers.updatePublisher(
                publisherId,
                publisherData
            );

            if (result.updated) {
                res.redirect('/publishers/');
            } else {
                res.status(404).json({ message: 'Publisher not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to delete publishers
    async deletePublisherHandler(req, res) {
        const publisherId = req.params.publisherId;
        try {
            const result = await Publishers.deletePublisher(publisherId);
            if (result.deleted) {
                res.status(200).json({
                    message: 'Publisher deleted successfully',
                });
            } else {
                res.status(404).json({ message: 'Publisher not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Export the controller class
module.exports = new PublishersController();
