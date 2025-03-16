const express = require('express');
const mysql = require('mysql2');
const cartController = require('./cartController'); // Import the controller
const router = require('./routes');  // Import the router
const createProduct= require("./createProductController")
const objectCrud = require("./objectCrud")
const updatedData=require("./updateObject")
const app = express();


// Body parser middleware to handle JSON requests
app.use(express.json());
// MySQL connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Test@123",
    database: "shop"
});

db.connect(function (err) {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
    
    // Pass the DB connection to the controller once the connection is established
    cartController.setDb(db);
    createProduct.setDb(db)
    objectCrud.setDb(db)
    //updatedData.setDb(db)

});

// Use the router for handling routes
app.use('/', router);

// Start the server
app.listen(8081, function () {
    console.log("Server started listening on port 8081...");
});
