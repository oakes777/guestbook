//get express package
const express = require('express');
const mariadb = require('mariadb');

//configure db connection
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sule',
    database: 'guestbook'
});

//connect to db
async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.error('Error connecting to the database: ' + err);
        throw new Error('Database connection error');
    }
}

//instantiate an express(web)app
const app = express();

//define port # for app to listen on
const PORT = 3000;

//tell app encode data into JSON
app.use(express.urlencoded({ extended: false }));

//tell app to use 'public' folder to serve static files
app.use(express.static('public'));

//set view (templating) agent/engine to EJS
//(we use templating engine/agent to create dynamic web pages)
app.set('view engine', 'ejs');

//define default route
app.get('/', (req, res) => {
    //render home page
    res.render('home');
});

//define 'confirm' route using GET method
app.get('/confirm', (req, res) => {
    //send res to client
    res.send('You need to post to this page!');
});

app.post('/confirm', async (req, res) => {
    const errors = [];
    const { fname, lname, email, mmethod, omeet } = req.body;

    //validate form fields
    if (!fname || fname.trim() === "") errors.push("First name is required.");
    if (!lname || lname.trim() === "") errors.push("Last name is required.");
    if (req.body.mlist && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        errors.push("Valid email is required for mailing list.");
    }
    if (mmethod === "other" && (!omeet || omeet.trim() === "")) {
        errors.push("Please specify how we met if 'Other' is selected.");
    }

    if (errors.length > 0) {
        return res.status(400).render('home', { errors });
    }

    try {
        //get db connection
        const conn = await pool.getConnection();
        //insert data into db
        await conn.query(
            `INSERT INTO entries (fname, lname, jtitle, company, linkedin, mmethod, omeet, message, mlist, eformat) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.body.fname,
                req.body.lname,
                req.body.jtitle || null,
                req.body.company || null,
                req.body.linkedin || null,
                req.body.mmethod,
                req.body.omeet || null,
                req.body.message || null,
                req.body.mlist ? 1 : 0,
                req.body.eformat || null,
            ]
        );
        conn.release();
        //redirect to admin-page to display all entries
        res.redirect('/confirmations');
    } catch (err) {
        console.error('Error inserting data:', err.message);
        res.status(500).send('Server error. Please try again later.');
    }
});


//define "confirm" route for admin-view
app.get('/confirmations', async (req, res) => {
    try {
        //get data from db
        const conn = await connect();

        //query db
        const rows = await conn.query('SELECT * FROM entries;');
        conn.release();

        //render admin-page with retrieved entries
        res.render('admin-page', { confirmations: rows });
    } catch (err) {
        console.error('Error retrieving data:', err.message);
        res.status(500).send('Failed to retrieve confirmations. Try again later');
    }
});

//tell app to listen for req on designated port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});
