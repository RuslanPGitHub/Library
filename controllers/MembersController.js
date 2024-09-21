// Importing the model
const Members = require('../models/MembersModel');

class MembersController {
    // Method to get all members
    async getMembersHandler(req, res) {
        try {
            const members = await Members.getAll();

            // Array of images for members in test data
            const files = [
                'man-user-circle-icon.svg',
                'woman-user-circle-icon.svg',
            ];

            // Function that randomly selects an image for a member from the array above
            function getRandomElement(arr) {
                const randomIndex = Math.floor(Math.random() * arr.length);
                return arr[randomIndex];
            }

            members.forEach((member) => {
                member.randomImage = getRandomElement(files);
            });

            res.render('members/MembersView', { members });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form for adding members
    async getMemberAddHandler(req, res) {
        try {
            res.render('members/MemberAddView');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for adding a member
    async postMemberAddHandler(req, res) {
        try {
            const lastID = await Members.addMember(req.body);
            res.render('members/MemberAddView', { lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method to get the view with the form for updating a member
    async getMemberUpdateHandler(req, res) {
        try {
            const memberId = req.params.memberId;
            const member = await Members.getById(memberId);
            res.render('members/MemberUpdateView', { member });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for updating a member
    async postMemberUpdateHandler(req, res) {
        try {
            const memberId = req.params.memberId;
            const memberData = req.body;
            const result = await Members.updateMember(memberId, memberData);

            if (result.updated) {
                res.redirect('/members/');
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Method for deleting a member
    async deleteMemberHandler(req, res) {
        const memberId = req.params.memberId;
        try {
            const result = await Members.deleteMember(memberId);
            if (result.deleted) {
                res.status(200).json({
                    message: 'Member deleted successfully',
                });
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Exporting the controller class
module.exports = new MembersController();
