const DEBUG = true;

//set up the server
const express = require( "express" );
const logger = require("morgan");
const db = require('./db/db_connection');
const app = express();
const port = 3000;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
 
// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

// define a route for the dream list page
const read_dreams_all_sql = `
    SELECT 
        dreamId, title, typeName, 
        dreams.typeId as typeId,
        DATE_FORMAT(date, "%m/%d/%Y") AS dateFormatted
    FROM dreams
    JOIN dream_type
        ON dreams.typeId = dream_type.typeId
    ORDER BY dreams.dreamId DESC
`
app.get( "/dreams", ( req, res ) => {
    db.execute(read_dreams_all_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            let data = { dreamlist : results };
            res.render('dreams', data);
            // What's passed to the rendered view: 
            //  dreamlist: [
            //     { dreamId: __ , title: __ , typeName: __ , typeId: __ ,  dateFormatted: __ },
            //     { dreamId: __ , title: __ , typeName: __ , typeId: __ ,   dateFormatted: __ },
            //     ...
            //  ]
            
        }
    });
});

// define a route for the dream detail page
const read_dream_detail_sql = `
    SELECT
        dreamId, title, typeName,
        dreams.typeId as typeId,
        DATE_FORMAT(date, "%W, %M %D, %Y ") AS dateFormatted,
        description
    FROM dreams
    JOIN dream_type
        ON dreams.typeId = dream_type.typeId
    WHERE dreamId = ?
`
app.get( "/dreams/:id", ( req, res ) => {
    db.execute(read_dream_detail_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No dream found with id = "${req.params.id}"` ); // NOT FOUND
        else {

            let data = {dream: results[0]}; // results is still an array, get first (only) element
            res.render('detail', data); 
            // What's passed to the rendered view: 
            //  dream: {dreamId: ___ , title: ___ , 
            //    typeName: ___ , typeId: ___, 
            //    dateFormatted: ___ , description: ___ 
            //  }
        }
    });
});

// define a route for dream DELETE
const delete_dream_sql = `
    DELETE 
    FROM
        dreams
    WHERE
        dreamId = ?
`
app.get("/dreams/:id/delete", ( req, res ) => {
    db.execute(delete_dream_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/dreams");
        }
    });
});

// define a route for dream CREATE
const create_dream_sql = `
    INSERT INTO dreams 
        (title, typeId, date, description) 
    VALUES 
        (?, ?, ?, ?);
`
app.post("/dreams", ( req, res ) => {
    db.execute(create_dream_sql, [req.body.title, req.body.type, req.body.date, req.body.description], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (assignmentId) of the newly inserted row.
            res.redirect(`/dreams/${results.insertId}`);
        }
    });
});

// define a route for dream UPDATE
const update_dream_sql = `
    UPDATE
        dreams
    SET
        title = ?,
        typeId = ?,
        date = ?,
        description = ?
    WHERE
        dreamId = ?
`
app.post("/dreams/:id", ( req, res ) => {
    db.execute(update_dream_sql, [req.body.title, req.body.type, req.body.date, req.body.description, req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/dreams/${req.params.id}`);
        }
    });
});

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );