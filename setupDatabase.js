// Database connection
const db = require('./core/db_connect');

// Importing the @faker-js/faker module for generating test data
const { faker } = require('@faker-js/faker');

// Function for executing queries using promises
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Function for inserting test data
async function insertTestData() {
    try {
        // Creating the books table
        await runQuery(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            author_id INTEGER NOT NULL,
            publisher_id INTEGER NOT NULL,
            year INTEGER,
            isbn VARCHAR(13),
            genre VARCHAR(100),
            description TEXT,
            FOREIGN KEY (author_id) REFERENCES authors(id),
            FOREIGN KEY (publisher_id) REFERENCES publishers(id)
        )`);

        // Creating the authors table
        await runQuery(`CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            birthdate DATE,
            biography TEXT
        )`);

        // Creating the publishers table
        await runQuery(`CREATE TABLE IF NOT EXISTS publishers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            phone VARCHAR(20),
            website VARCHAR(255)
        )`);

        // Creating the members table
        await runQuery(`CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            birthdate DATE,
            address VARCHAR(255),
            phone VARCHAR(20),
            email VARCHAR(255)
        )`);

        // Creating the loans table
        await runQuery(`CREATE TABLE IF NOT EXISTS loans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            member_id INTEGER NOT NULL,
            loan_date DATE NOT NULL,
            return_date DATE,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books(id),
            FOREIGN KEY (member_id) REFERENCES members(id)
        )`);

        // Creating the reservations table
        await runQuery(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            member_id INTEGER NOT NULL,
            reservation_date DATE NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books(id),
            FOREIGN KEY (member_id) REFERENCES members(id)
        )`);

        // Inserting test data into the authors table
        const authors = [];
        for (let i = 0; i < 5; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const birthdate = faker.date
                .past(50, new Date(2000, 0, 1))
                .toISOString()
                .split('T')[0];
            const biography = faker.lorem.paragraph();

            const author = await runQuery(
                `INSERT INTO authors (first_name, last_name, birthdate, biography) VALUES (?, ?, ?, ?)`,
                [firstName, lastName, birthdate, biography]
            );
            authors.push(author.lastID);
        }

        // Inserting test data into the publishers table
        const publishers = [];
        for (let i = 0; i < 5; i++) {
            const name = faker.company.name();
            const address = faker.location.streetAddress();
            const phone = faker.phone.number();
            const website = faker.internet.url();

            const publisher = await runQuery(
                `INSERT INTO publishers (name, address, phone, website) VALUES (?, ?, ?, ?)`,
                [name, address, phone, website]
            );
            publishers.push(publisher.lastID);
        }

        // Inserting test data into the members table
        const members = [];
        for (let i = 0; i < 10; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const birthdate = faker.date
                .past(30, new Date(1995, 0, 1))
                .toISOString()
                .split('T')[0];
            const address = faker.location.streetAddress();
            const phone = faker.phone.number();
            const email = faker.internet.email();

            const member = await runQuery(
                `INSERT INTO members (first_name, last_name, birthdate, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)`,
                [firstName, lastName, birthdate, address, phone, email]
            );
            members.push(member.lastID);
        }

        // Inserting test data into the books table
        for (let i = 0; i < 30; i++) {
            const title = faker.lorem.words(3);
            const authorId = authors[i % authors.length];
            const publisherId = publishers[i % publishers.length];
            const year = faker.date.past(20).getFullYear();
            const isbn = faker.random.numeric(13);
            const genre = faker.music.genre();
            const description = faker.lorem.paragraph();

            await runQuery(
                `INSERT INTO books (title, author_id, publisher_id, year, isbn, genre, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, authorId, publisherId, year, isbn, genre, description]
            );
        }

        // Inserting test data into the loans and reservations tables
        for (let i = 0; i < 10; i++) {
            const bookId = Math.floor(Math.random() * 30) + 1;
            const memberId = members[i % members.length];
            const loanDate = faker.date.past(1).toISOString().split('T')[0];
            const returnDate = faker.date
                .future(0.5)
                .toISOString()
                .split('T')[0];
            const status = i % 2 === 0 ? 'borrowed' : 'returned';

            await runQuery(
                `INSERT INTO loans (book_id, member_id, loan_date, return_date, status) VALUES (?, ?, ?, ?, ?)`,
                [bookId, memberId, loanDate, returnDate, status]
            );

            const reservationDate = faker.date
                .past(1)
                .toISOString()
                .split('T')[0];
            const reservationStatus = i % 2 === 0 ? 'reserved' : 'canceled';

            await runQuery(
                `INSERT INTO reservations (book_id, member_id, reservation_date, status) VALUES (?, ?, ?, ?)`,
                [bookId, memberId, reservationDate, reservationStatus]
            );
        }

        console.log('Test data inserted successfully');
    } catch (err) {
        console.error('Error inserting test data:', err);
    } finally {
        // Closing the database
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database closed successfully');
            }
        });
    }
}

// Calling the function to create the database and fill it with test data
insertTestData();
