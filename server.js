const express = require('express');
const mysql = require('mysql2');
const cartController = require('./cartController'); // Import the controller
const router = require('./routes');  // Import the router
const createProduct= require("./createProductController")
const objectCrud = require("./objectCrud")
const createProd = require('./controllers/addPoduct');
const sequelize=require('./config/database')
//const updatedData=require("./updateObject")
const app = express();
const cors = require("cors");

// ✅ Allow all origins (for development)
app.use(cors());

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
    createProd.setDb(db)
    //updatedData.setDb(db)

});




sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    //return sequelize.sync(); // Automatically create table if not exist
  })
  .then(() => {
    app.listen(() => {
      console.log(`🚀 Server running at http://localhost:-----------`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err.message);
    process.exit(1);
  });



// Use the router for handling routes
app.use('/', router);

// Start the server
app.listen(8081, function () {
    console.log("Server started listening on port 8081...");
});