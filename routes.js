const express = require('express');
const router = express.Router();

const cartController = require("./cartController");  // Import the controller
const loginController=require("./loginController");
const createProduct=require("./createProductController");

// Define routes for variants and modifiers
// router.get("/variants", cartController.createCart);
//router.get("/modifiers", cartController.modifiers);
router.post("/variants",loginController.verifyUser, cartController.createCart);
router.post("/api/login",loginController.loginApi)
router.post("/createProduct",createProduct.createProduct)
// Export the router
module.exports = router;
