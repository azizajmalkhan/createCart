const express = require('express');
const router = express.Router();

const cartController = require("./cartController");  // Import the controller
const loginController=require("./loginController");
const createProductController=require("./createProductController")
const crudObject = require("./objectCrud")
const updatePro = require("./updateProductController")
const deleteProduct = require("./controllers/deletePtoduct")
const getProducts =require("./controllers/getProduct")
const createProd=require("./controllers/addPoduct")
const updateproduct = require("./controllers/updateProduct")
const   createord=require("./controllers/createOrder")
// Define routes for variants and modifiers
// router.get("/variants", cartController.createCart);
//router.get("/modifiers", cartController.modifiers);
router.post("/variants",loginController.verifyUser, cartController.createCart);
router.post("/api/login",loginController.loginApi)
router.post("/createProduct",createProductController.createProduct)//object_name
router.get("/obj/:object_name",crudObject.getData)
router.post("/obj/:object_name",crudObject.postData)
router.delete("/obj/:object_name/:id",crudObject.deleteData)
router.post('/products', updatePro.updateProduct)
router.delete('/products/deleteProduct', deleteProduct)
router.get("/getproducts",getProducts)
router.post("/products/createProduct",createProd.createProduct)
router.post("/products/updateprodct",updateproduct.updateProduct)

router.post("/orders/createOrder",createord)

// Export the router
module.exports = router;