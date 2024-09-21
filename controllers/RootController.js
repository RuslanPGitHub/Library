// Render the view for the home page
const getRootHandler = (req, res) => {
    res.render('RootView', {});
};

// Export the controller class
module.exports = { getRootHandler };
