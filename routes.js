const express = require('express');
const router = express.Router();

const cartController = require("./cartController");  // Import the controller
const loginController=require("./loginController");

// Define routes for variants and modifiers
// router.get("/variants", cartController.createCart);
//router.get("/modifiers", cartController.modifiers);
router.post("/variants",loginController.verifyUser, cartController.createCart);
router.post("/api/login",loginController.loginApi)
// Export the router
module.exports = router;
