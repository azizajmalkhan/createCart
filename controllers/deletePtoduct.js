const product = require("../productModule") 
const variant = require("../models/variant")
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('shop', 'root', 'Test@123', {
    host: 'localhost',
    dialect: 'mysql'
});

//  const deleteProduct = async (req, res) => {
//     let response = {};
//     if (req && req.body && req.body.id) {
//         let product_id = req.body.id;

//         try {
//             let delete_product = await product.destroy({ where: { id: product_id } });
//             if (delete_product) {
//                 response["product"] = { "status": "success", "message": "Product deleted successfully" };
//                 return res.status(200).json(response);
//             } else {
//                 return res.status(404).json({ status: "error", message: "Product not found" });
//             }
//         } catch (error) {
//             return res.status(500).json({ status: "error", message: error.message });
//         }
//     } else {
//         return res.status(400).json({ status: "error", message: "Incorrect body format" });
//     }
// };





const deleteProduct = async (req, res) => {
    let response = {};
    if (req && req.body && req.body.id) {
        let product_id = req.body.id;
          const transaction = await sequelize.transaction();
        try {
            // Delete the product
            let delete_product = await product.destroy({ where: { id: product_id }, transaction });
            if (delete_product) {
                // Fetch variant IDs
                let variants = await variant.findAll({ where: { product_id: product_id }, attributes: ['id'], transaction });
                if (variants.length > 0) {
                    // Delete variants
                    let variant_ids = variants.map(v => v.id);
                    await variant.destroy({ where: { id: variant_ids }, transaction });
                }

                // Commit the transaction
                await transaction.commit();

                response["product"] = { "status": "success", "message": "Product and variants deleted successfully" };
                return res.status(200).json(response);
            } else {
                // Rollback the transaction
                await transaction.rollback();
                return res.status(404).json({ status: "error", message: "Product not found" });
            }
        } catch (error) {
            // Rollback the transaction in case of error
            if (transaction) await transaction.rollback();
            return res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        return res.status(400).json({ status: "error", message: "Incorrect body format" });
    }
};



module.exports=deleteProduct