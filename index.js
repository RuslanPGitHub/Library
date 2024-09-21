// Use .env
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Include modules 
const express = require('express');
const path = require('path');

// Include routes
const router = require('./routes');

// create app
const app = express();

// Setting up the views directory
app.set('views', path.join(__dirname, 'views'));

// Configuring EJS as the template engine
app.set('view engine', 'ejs');

// Configuring static files
app.use(express.static(path.join(__dirname, 'public')));

// Converting JSON to JS Object in POST, PUT, PATCH requests
app.use(express.json());

// Converting form data to JS Object in POST, PUT, PATCH requests
app.use(express.urlencoded({ extended: true }));

// Use all routes
app.use(router);

// Middleware for 404 page
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
