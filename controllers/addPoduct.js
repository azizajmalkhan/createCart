// Sanitize function to replace empty strings and undefined with null
// function sanitizeData(data) {
//     Object.keys(data).forEach(key => {
//         if (data[key] === '' || data[key] === undefined) {
//             data[key] = null; // Set null for empty strings and undefined fields
//         }
//     });
//     return data;
// }

function sanitizeData(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeData);
    } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === '' || obj[key] === undefined) {
                obj[key] = null;
            } else if (typeof obj[key] === 'object') {
                obj[key] = sanitizeData(obj[key]);
            }
        });
        return obj;
    } else {
        return obj;
    }
}


const createProduct = async (req, res) => {
    console.log("Inside createProduct");

    let data = req.body;

    // ✅ FIXED: Sanitize the data here
    data = sanitizeData(data);

    console.log('Sanitized Data:', JSON.stringify(data, null, 2));

    // Step 2: Check if the product already exists
    let product_exists = await checkProductName(data.name);
    if (product_exists) {
        return res.json({
            error: "Product already exists"
        });
    }

    // Step 3: Insert new product data
    let product_response;
    try {
        const insertResult = await createProductData(data);
        product_response = {
            message: 'Product created successfully',
            productId: insertResult.insertId,
        };
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // Step 4: Create variants if product was created successfully
    if (product_response && product_response.productId) {
        try {
            const inserted_variants = await createVariantData(data, product_response.productId);
            return res.status(201).json({
                message: 'Product and variant created successfully',
                productId: inserted_variants.insertId,
            });
        } catch (err) {
            return res.status(500).json({ error: 'Failed to create variant' });
        }
    }
};

// Check if product name already exists
async function checkProductName(product_name) {
    if (product_name) {
        let get_query = "SELECT name FROM shop.products WHERE name = ?";
        const get_query_results = await queryAsync(get_query, [product_name]);
        return get_query_results.length > 0;
    }
    return false;
}

// ✅ Product insertion function
const createProductData = async (data) => {
    if (data) {
        const productData = {
            name: data.name,
            description: data.description,
            status: data.status || 'active',
            price: data.price || 0.00,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const columns = Object.keys(productData).join(", ");
        const values = Object.values(productData);
        const placeholders = values.map(() => '?').join(", ");

        const create_query = `INSERT INTO shop.products (${columns}) VALUES (${placeholders})`;

        try {
            const createdData = await queryAsync(create_query, values);
            return createdData;
        } catch (err) {
            throw new Error(`Error inserting product data: ${err.message}`);
        }
    } else {
        throw new Error('Invalid product data');
    }
};

// ✅ Variant insertion function
const createVariantData = async (data, product_id) => {
    if (!data.variants || !data.variants.variant_config_data) {
        return { insertId: null };
    }

    const variants = data.variants.variant_config_data.map(item => [
        product_id,
        item.name || "Unnamed Variant",
        item.tax_category_id,
        new Date(),
        new Date()
    ]);

    const keys = ['product_id', 'name', 'tax_category_id', 'createdAt', 'updatedAt'].join(", ");
    const placeholders = variants.map(() => '(' + new Array(5).fill('?').join(', ') + ')').join(", ");

    const query = `INSERT INTO shop.variants (${keys}) VALUES ${placeholders}`;

    try {
        const inserted_data = await queryAsync(query, [].concat(...variants)); // flatten values
        return inserted_data;
    } catch (err) {
        throw new Error(`Error inserting variant data: ${err.message}`);
    }
};

// Async DB wrapper
let db;
function setDb(connection) {
    db = connection;
}

function queryAsync(query, params) {
    return new Promise((resolve, reject) => {
        db.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Export
module.exports = {
    setDb,
    createProduct
};
