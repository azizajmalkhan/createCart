const express = require('express');
const router = express.Router();

const cartController = require("./cartController");  // Import the controller
const loginController=require("./loginController");
const createProduct=require("./createProductController");
const object_crud=require("./objectCrud")
const updated_data=require("./updateObject")
const sendEmail = require("./notifyWorkflow")
// Define routes for variants and modifiers
// router.get("/variants", cartController.createCart);
//router.get("/modifiers", cartController.modifiers);
router.post("/variants",loginController.verifyUser, cartController.createCart);
router.post("/api/login",loginController.loginApi)
router.post("/createProduct",createProduct.createProduct)
router.post("/object/:object_name",object_crud.postData)
//router.put("/object/:object_name/:id",updated_data.updateData)

router.put("/object/:object_name/:id",object_crud.updateData)

router.get("/object/:object_name",object_crud.getData)
router.post("/sendEmail",sendEmail.sendEmail)
// Export the router
module.exports = router;
