const Product = require("../productModule")
const getProducts = (req, res) => {
    Product.findAll()
        .then(product_details => {
            return res.status(200).json(product_details);
        })
        .catch(err => {
            return res.status(500).json({ status: "error", message: err.message });
        });
}


// async function getAllProducts() {
//      try {
//        const products = await Product.findAll();
//        console.log(products);
//      } catch (error) {
//        console.error('Error fetching products:', error);
//      }
//    }

//    getAllProducts();
module.exports = getProducts