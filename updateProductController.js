// const Product = require('./productModule');

// const updateProduct = async (req, res) => {
//   const { productId, updatedData } = req.body;

//   try {
//     const result = await Product.update(updatedData, {
//       where: { id: productId }
//     });

//     if (result[0] === 0) {
//       res.status(404).json({ message: 'No product found with the specified ID.' });
//     } else {
//       res.status(200).json({ message: 'Product updated successfully.' });
//     }
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Error updating product', error: error.message });
//   }
// };
// // updateProduct(1, {
// //   name: 'Updated Name', // Ensure this is a string if your column expects a string
// //   price: 99.99,
// //   description: 'Updated description'
// // });

// module.exports = {
//     updateProduct
//   };


const Product = require("./productModule");
const Variant = require("./models/variant");

 
const updateProduct = async (req, res) => {
    if (req) {
        let data = req.body;
        let create_variants = [];
        let update_variants = [];
        let delete_variants = [];
        
        if (data && data.variants && data.variants.config_data && data.variants.config_data.length > 0) {
            create_variants = data.variants.config_data;
        }
        if (data && data.variants && data.variants.update_variants && data.variants.update_variants.length > 0) {
            update_variants = data.variants.update_variants;
        }
        if (data && data.variants && data.variants.delete_variants && data.variants.delete_variants.length > 0) {
            delete_variants = data.variants.delete_variants;
        }

        try {
            let product_results = await updateProductData(data);
            if (product_results.status == 200) {
                let response = {};

                if (update_variants && update_variants.length > 0) {
                    let updated_variants = await updateVirtualBrand(update_variants);
                    response["updated_variants"] = updated_variants;
                }
                if (create_variants && create_variants.length > 0) {
                    let created_variants = await createVirtualBrands(create_variants);
                    response["created_variants"] = created_variants;
                }
                if (delete_variants && delete_variants.length > 0) {
                    let deleted_variants = await bulkDeleteVariants(delete_variants);
                    response["deleted_variants"] = deleted_variants;
                }

                res.status(200).json(response);
            } else {
                res.status(product_results.status).json({ message: product_results.message });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
            console.log(err);
        }
    } else {
        res.status(400).json({ message: "Invalid Payload" });
    }
};

const updateProductData = async (data) => {
    if (data) {
        let update_data = {
            "name": data.name || "",
            "description": data.description || "",
            "price": data.price || "",
        };
        let productId = data.id;
        try {
            const result = await Product.update(update_data, {
                where: { id: productId }
            });

            if (result[0] === 0) {
                return { status: 404, message: 'No product found with the specified ID.' };
            } else {
                return { status: 200, message: 'Product updated successfully.' };
            }
        } catch (error) {
            console.error('Error updating product:', error);
            return { status: 500, message: 'Error updating product', error: error.message };
        }
    }
};

const updateVirtualBrand = async (variant_data) => {
    if (variant_data && variant_data.length > 0) {
       let results= await Promise.all(variant_data.map(update =>
            Variant.update(
                {
                    //tax_category_id: update.tax_category_id,
                    name: update.name
                },
                { where: { id: update.id } }
            )
        ));
        return results 
    }
};

async function createVirtualBrands(create_brands) {
    if (create_brands) {
        let results = await Variant.bulkCreate(create_brands);
        return results
    }
}

const bulkDeleteVariants = async (delete_variants) => {
    if (delete_variants && delete_variants.length > 0) {
        let results = await Variant.destroy({
            where: {
                id: delete_variants
            }
        });
        return results
    }
    
};

module.exports = {
    updateProduct
};
