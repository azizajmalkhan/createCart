const loginController = require("./loginController");
const getdeliveryFee = require("./getDeliveryCharges")
let db;  // Declare a variable to hold the DB connection
 
// This method sets the DB connection
function setDb(connection) {
    db = connection;
}
 
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, function (err, results) {
            if (err) {
                console.error('Query failed:', err.message); // Log the message
                console.error('Stack trace:', err.stack);   // Log the stack trace
                reject({
                    message: 'Query failed',
                    error: err,
                    query: sql,
                    params: params
                });
            } else {
                resolve(results);
                console.log(results);
                
            }
        });
    });
}
 
 
 
// Define a single function to handle both variants and modifiers
const createCart = async (req, res) => {
 
    let reqq = req.body
    //debugger;
    var variant_ids = [];
    let modifiers_ids = [];
    let tax_category_ids = []
 
    
async function delivery_fee() {
    try {
       let  delivery_fee = await getdeliveryFee();
       console.log("Delivery fee stored:", delivery_fee);
        return delivery_fee // Wait for the promise to resolve
      
    } catch (error) {
        console.error("Error fetching delivery fee:", error);
    }
}
 
    if (reqq && reqq.data && reqq.data.order_details) {
        reqq.data.order_details.forEach(function (order_details) {
            variant_ids.push(order_details.variant_id)
            tax_category_ids.push(order_details.tax_category_id)
            if (order_details.selected_options && order_details.selected_options.length > 0 && order_details.selected_options[0].modifiers.length > 0) {
 
                order_details.selected_options[0].modifiers.forEach(function (modifiers) {
modifiers_ids.push(modifiers.id)
                    tax_category_ids.push(modifiers.tax_category_id)
                })
            }
            if (order_details.product_modifiers && order_details.product_modifiers.length > 0) {
                order_details.product_modifiers.forEach(function (prd_modifiers) {
                    tax_category_ids.push(prd_modifiers.tax_category_id)
modifiers_ids.push(prd_modifiers.id)
                })
            }
        })
    }
 
    console.log("tax_category_id" ,tax_category_ids);
    
   var variantsQuery = "SELECT id as variant_id,price as variant_price  FROM shop.variants where id in (?)";
    let modifiersQuery = "SELECT id as modifier_id,price as modifier_price FROM shop.modifiers where id in (?)";
    //
let taxQuery = "SELECT id as tax_id,tax_price as percentage FROM shop.tax where id in (?)";
    try {
        // Run both queries concurrently using Promise.all
        // const [variantsData, modifiersData] = await Promise.all([
        //     queryAsync(variantsQuery),
        //     queryAsync(modifiersQuery)
        // ]);
 
 
        // const variantsData = await queryAsync(variantsQuery, [variant_ids])
        // const modifiersData = await queryAsync(modifiersQuery, [modifiers_ids])
 
 
        var variantsData = []
        if (variant_ids.length > 0) {
            variantsData = await queryAsync(variantsQuery, [variant_ids])
        }
        console.log("variantsData",variantsData);
        
        var modifiersData = []
        if (modifiers_ids.length > 0) {
            modifiersData = await queryAsync(modifiersQuery, [modifiers_ids])
        }
      
        if (tax_category_ids.length > 0) {
            var taxData = await queryAsync(taxQuery, [tax_category_ids]);
            console.log(taxData);
            
        }
        console.log(tax_category_ids);
        
        var tax_total = 0;
       
 
        let reqq;
        if (typeof req.body === 'string') {
            reqq = JSON.parse(req.body);
        } else {
            reqq = req.body;
        }
        console.log(reqq);
 
        //console.log(subTotal(reqq,variants,modifiers));
        var total_price = 0
        total_price = subTotal(reqq, variantsData, modifiersData)
 
        console.log(total_price);
        console.log(taxTotal(total_price, reqq.data, taxData, reqq.data.is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data));
 
        function subTotal(reqq, variants, modifiers) {
            let sub_total = 0;
            if (reqq && variants || modifiers) {
                if (reqq.data && reqq.data.order_details && reqq.data.order_details.length > 0) {
                    reqq.data.order_details.forEach(function (item) {
                        let price = 0
                        if (variants && variants.length > 0) {
                            variants.forEach(function (variant_item) {
                                if (variant_item.variant_id == item.variant_id) {
                                    price += variant_item.variant_price
                                }
                            })
                        }
 
 
                        if (item.selected_options && item.selected_options[0].modifiers && item.selected_options[0].modifiers.length > 0) {
                            price += getmodifiersPrice(item.selected_options[0].modifiers, modifiers)
                        }
                        if (item.product_modifiers && item.product_modifiers.length > 0) {
                            price += getmodifiersPrice(item.product_modifiers, modifiers)
 
                        }
 
                        sub_total += price * Number(item.quantity)
                    })
                }
            }
 
 
            function getmodifiersPrice(input_modifiers, modifiers) {
                let modifiers_price = 0
                if (input_modifiers && modifiers) {
                    input_modifiers.forEach(function (item) {
                        modifiers.forEach(function (modifier_item) {
if (item.id == modifier_item.modifier_id) {
                                modifiers_price += modifier_item.modifier_price * item.quantity
                            }
                        })
                    })
                }
                // console.log(price);
 
                return modifiers_price
            }
 
 
            return sub_total
 
        }
 
 
        // observe quantity 3 modifiers * product qunatity
        // 10 * 3 * 2
        //modifiers is 3 quantity and products 2 quantity
 
        //let total_tax = taxTotal(total_price,reqq.data, tax_data,is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data)
        //console.log(total_tax);
        function taxTotal(total_price, initial_data, tax_data, is_coupon_applied, coupon_data, is_reward_redeemed, redeem_data) {
 
            let tax_sub_total = 0;
            if (initial_data && tax_data) {
                if (initial_data && initial_data.order_details.length > 0) {
                    initial_data.order_details.forEach(function (initial) {
                        tax_data.forEach(function (tax) {
                            if (initial.tax_id == tax.tax_id) {
                                let product_share = (total_price > 0) ? (Number(initial.price) * Number(initial.quantity) / total_price) : 0
                                let discounted_price = applyDiscount(product_share, initial.price, initial.quantity)
                                tax_sub_total += calculateTax(discounted_price, Num(tax.percentage))
                                if (initial.selected_options && initial.selected_options && initial.selected_options[0].modifiers.length > 0) {
                                    initial.selected_options[0].modifiers.forEach(function (option_modifiers) {
                                        tax_data.forEach(function (tax_data) {
                                            if (tax_data.tax_id == option_modifiers.tax_category_id) {
                                                let product_share = (total_price > 0) ? (Number(option_modifiers.default_price) * Number(option_modifiers.quantity) * Number(initial.quantity) / total_price) : 0
                                                let discounted_price = applyDiscount(product_share, initial.price, Number(option_modifiers.quantity) * Number(initial.quantity))
                                                tax_sub_total += calculateTax(discounted_price, tax.percentage)
                                            }
                                        })
                                    })
                                }
 
                            }
                        })
                        if (initial.product_modifiers && initial.product_modifiers.length > 0) {
                            initial.product_modifiers.forEach(function (prd_modifiers) {
                                tax_data.forEach(function (tax) {
                                    if (tax.tax_id == prd_modifiers.tax_category_id) {
                                        let product_share = (total_price > 0) ? (Number(prd_modifiers.default_price) * Number(prd_modifiers.quantity) * Number(initial.quantity) / total_price) : 0
                                        let discounted_price = applyDiscount(product_share, initial.price, Number(prd_modifiers.quantity) * Number(initial.quantity))
                                        tax_sub_total += calculateTax(discounted_price, tax.percentage)
                                    }
                                })
                            })
                        }
                    })
                }
 
                function applyDiscount(product_share, price, quantity) {
                    let final_product = price * quantity
                    if (coupon_data) {
                        if (coupon_data.discount_type == "amount") {
                            let coupon_discount_share = coupon_data.amount * product_share
                            let final_product = final_product - coupon_discount_share
                        }
                        if (coupon_data.discount_type == "percentage") {
                            let discount_percentage = Number(coupon_data.percentage) / 100
                            let promotion_amount = total_price * (1 - discount_percentage)
                            let discounted_price = total_price - promotion_amount
                            if (discounted_price < coupon_data.percentage_limit) {
                                let discounted_product_price = final_product * (1 - discount_percentage)
                                final_product -= discounted_product_price
                            }
                            else {
                                let coupon_discount_share = (coupon_data.percentage_limit) * product_share
                                final_product -= coupon_discount_share
                            }
                        }
                        //console.log(promotion_amount);
                    }
 
                    // if (tempRedeemData) {
                    // if (tempRedeemData) {
                //     if (tempRedeemData.data && tempRedeemData.data.value) {
                //         var reward_discount_share = Number(tempRedeemData.data.value) * product_share;
                //         final_price -= reward_discount_share;
                //         // var discounted_price = total_product_price - discount_share;
                //         // console.log("Discount", Math.max(discounted_price / quantity, 0));
                //         //return Math.max(discounted_price / quantity, 0);
                //         //return discounted_price;
                //     }
                // }
                return final_product.toFixed()
            }
        }

        function calculateTax(discounted_price, tax_percentage) {
            product_tax = 0
            if (discounted_price) {
                product_tax = (discounted_price) * tax_percentage / 100
            }
            return product_tax

        }

        return tax_sub_total
    }

    }
    catch(error){
        console.log(error);
        
    }
};
 
// Export the setDb method and the createCart function
module.exports = {
    setDb: setDb,
    createCart: createCart
};







const { setDb } = require("./cartController");

// Sanitize function to replace empty strings with null
function sanitizeData(data) {
    Object.keys(data).forEach(key => {
        if (data[key] === '') {
            data[key] = null; // replace empty strings with null
        }
    });
    return data;
}

const createProduct = async (req, res) => {
    let data = req.body;

    // Step 1: Sanitize data (replace empty strings with null)
    data = sanitizeData(data);

    // Step 2: Check if the product already exists
    let product_exists = await checkProductName(data.name);
    if (product_exists) {
        return res.json({
            error: "Product already exists"
        });
    }

    // Step 3: Insert new product data
    try {
        const insertResult = await createProductData(data);
        var product_response = {
            message: 'Product created successfully',
            productId: insertResult.insertId,
        };
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // Step 4: Create variants if product was created successfully
    if (product_response && product_response.productId) {
        const inserted_variants = await createVariantData(data, product_response.productId);
        if (inserted_variants && inserted_variants.insertId) {
            return res.status(201).json({
                message: 'Product and variant created successfully',
                productId: inserted_variants.insertId,
            });
        } else {
            return res.status(500).json({ error: 'Failed to create variant' });
        }
    }
};

// Check if product name already exists
async function checkProductName(product_name) {
    if (product_name) {
        let get_query = "SELECT name FROM shop.product WHERE name = ?";
        const get_query_results = await queryAsync(get_query, [product_name]);
        return get_query_results.length > 0; // If product exists, return true
    }
    return false; // If no product name is provided, return false
}

// Create product data in the database
async function createProductData(data) {
    if (data) {
        let productData = {
            "s_created_at": data.s_created_at,
            "s_updated_at": data.s_updated_at,
            "is_deleted": data.s_updated_at,
            "op_id": data.op_id,
            "op_type": data.op_type,
            "name": data.name,
            "description": data.description,
            "tax_category_id": data.tax_category_id,
            "meta_title": data.meta_title,
            "status": data.status,
            "store_id": data.store_id,
            "taxonomy_id": data.taxonomy_id,
            "option_type_ids": data.option_type_ids,
            "barcode": data.barcode,
            "service_type": data.service_type,
            "price": data.price,
            "files": data.files,
            "industry_id": data.industry_id,
            "stock": data.stock,
            "is_single_variant": data.is_single_variant,
            "is_preference": data.is_preference,
            "barcode_type": data.barcode_type,
            "modifier": data.modifier
        }

        let columns = Object.keys(productData).join(", ");
        let values = Object.values(productData).map(item => {
            if (typeof item === 'object') {
                return JSON.stringify(item); // Serialize objects
            }
            return item;
        });
        let placeholders = values.map(() => '?').join(", "); // Correct placeholder format
        const create_query = `INSERT INTO shop.product (${columns}) VALUES (${placeholders})`;

        const createdData = await queryAsync(create_query, values); // Use values as the second argument
        return createdData;
    }
    throw new Error('Invalid data'); // Error handling if data is invalid
}

// Create variant data in the database
async function createVariantData(data, product_id) {
    let variant_data = {
        "s_created_by": data.s_created_by,
        "s_updated_by": data.s_updated_by,
        "s_created_at": data.s_created_at,
        "s_updated_at": data.s_updated_at,
        "is_deleted": data.is_deleted,
        "row_version": data.row_version,
        "s_created_ip": data.s_created_ip,
        "s_updated_ip": data.s_updated_ip,
        "account_id": data.account_id,
        "application_id": data.application_id,
        "txn_id": data.txn_id,
        "op_id": data.op_id,
        "op_type": data.op_type,
        "product_id": product_id,
        "cost_price": data.cost_price,
        "tax_category_id": data.tax_category_id,
        "price": data.price,
        "is_active": data.is_active,
        "name": data.name,
        "variant_options": data.variant_options,
        "store_id": data.store_id
    }

    let keys = Object.keys(variant_data).join(",");
    let values = Object.values(variant_data);
    let placeholders = values.map(() => '?');
    let query = `INSERT INTO shop.variants (${keys}) VALUES (${placeholders})`;
    let inserted_data = await queryAsync(query, values);
    return inserted_data;
}

// Database query async wrapper
let db;
function setDb(connection) {
    db = connection;
}

function queryAsync(query, params) {
    return new Promise((resolve, reject) => {
        db.execute(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    setDb: setDb,
    createProduct
};


/*


Key Differences Between query and execute
============================================

Feature	--                                    query()                                              	execute()

Purpose	                        Executes SQL queries (static and dynamic).	             Primarily used for executing prepared statements with 													parameterized queries.
-----------------------------------------------------------------------------------------------------------------------------------------------------
Parameterized Queries    	Supports parameterized queries (but not as strongly).	     Designed specifically for parameterized queries, with automatic                                            

                                                                                                  protection against SQL injection.

-----------------------------------------------------------------------------------------------------------------------------------------------------
Use Case	                Works for both static queries and simple dynamic queries.	Ideal for handling user input with prepared statements.

-----------------------------------------------------------------------------------------------------------------------------------------------------
Syntax	                        connection.query(sql, params, callback)                      	connection.execute(sql, params, callback)

-----------------------------------------------------------------------------------------------------------------------------------------------------
SQL Injection Protection	Provides basic protection for simple queries but needs           Stronger protection by ensuring parameters are sent 
                                careful handling.	.                                               separately

-----------------------------------------------------------------------------------------------------------------------------------------------------
Performance	                 May be less efficient for complex queries as the                Can be more efficient for repeated queries due to the .
                                   query plan is not cached.	                                  prepared statement's cached execution plan

-----------------------------------------------------------------------------------------------------------------------------------------------------

When to Use query() vs. execute()
=====================================
Use query():

For simple queries (e.g., SELECT, INSERT) where you don’t expect to interact with user input directly.
For static SQL queries (e.g., fixed SELECT statements).
Use execute():

For parameterized queries where user input is involved (e.g., user-provided search terms, form data).
When you need to ensure SQL injection protection for user-generated data.
For repeated execution of the same query structure (as the server can optimize repeated queries using prepared statements).

Example : 1  : query
================
connection.query('SELECT * FROM users WHERE username = "admin"', (err, results) => {
  if (err) throw err;
  console.log(results);
});

Example : 2  : execute
================
const username = req.body.username; // Assume this comes from user input
connection.execute('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
  if (err) throw err;
  console.log(results);
});



CREATE TABLE shop.product (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Assuming an auto-incrementing ID for the product
    s_created_at DATETIME NOT NULL,
    s_updated_at DATETIME NOT NULL,
    is_deleted BOOLEAN NOT NULL,  -- Since is_deleted should be a boolean, adjust its type
    op_id INT NOT NULL,  -- Assuming op_id is an integer
    op_type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tax_category_id INT NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,  -- Assuming 'status' is a short string, adjust size as needed
    store_id INT NOT NULL,
    taxonomy_id INT NOT NULL,
    option_type_ids JSON,  -- Assuming this is a JSON array
    barcode VARCHAR(255),  -- Optional, assuming a barcode can be a string
    service_type VARCHAR(255),  -- Optional, assuming service_type is a string
    price DECIMAL(10, 2) NOT NULL,  -- Price as decimal for precision (10 digits, 2 after decimal)
    files JSON,  -- Assuming files can be represented as a JSON array
    industry_id INT NOT NULL,
    stock INT NOT NULL,  -- Assuming stock is an integer
    is_single_variant BOOLEAN NOT NULL,
    is_preference BOOLEAN NOT NULL,
    barcode_type VARCHAR(50),  -- Optional, assuming barcode_type is a short string
    modifier JSON  -- Optional, assuming modifier is a text field
);





ALTER TABLE shop.variants
    -- Adding the new columns
    ADD COLUMN s_created_by VARCHAR(255) NOT NULL,
    ADD COLUMN s_updated_by VARCHAR(255) NOT NULL,
    ADD COLUMN s_created_at DATETIME NOT NULL,
    ADD COLUMN s_updated_at DATETIME NOT NULL,
    ADD COLUMN is_deleted BOOLEAN NOT NULL,
    ADD COLUMN row_version VARCHAR(255),
    ADD COLUMN s_created_ip VARCHAR(255),
    ADD COLUMN s_updated_ip VARCHAR(255),
    ADD COLUMN account_id BIGINT NOT NULL,
    ADD COLUMN application_id BIGINT NOT NULL,
    ADD COLUMN txn_id BIGINT NOT NULL,
    ADD COLUMN op_id BIGINT NOT NULL,
    ADD COLUMN op_type VARCHAR(255) NOT NULL,
    ADD COLUMN product_id INT NOT NULL,
    ADD COLUMN cost_price DECIMAL(10, 2),  -- Nullable price field
    ADD COLUMN is_active BOOLEAN NOT NULL,
    ADD COLUMN variant_options JSON,  -- To store the variant configuration data
    ADD COLUMN store_id BIGINT,  -- Store ID (nullable)

    -- Adding foreign key constraint without cascading rules
    ADD FOREIGN KEY (product_id) REFERENCES shop.product(id);


15:26:07	ALTER TABLE shop.variants     -- Adding the new columns     ADD COLUMN s_created_by VARCHAR(255) NOT NULL,     ADD COLUMN s_updated_by VARCHAR(255) NOT NULL,     ADD COLUMN s_created_at DATETIME NOT NULL,     ADD COLUMN s_updated_at DATETIME NOT NULL,     ADD COLUMN is_deleted BOOLEAN NOT NULL,     ADD COLUMN row_version VARCHAR(255),     ADD COLUMN s_created_ip VARCHAR(255),     ADD COLUMN s_updated_ip VARCHAR(255),     ADD COLUMN account_id BIGINT NOT NULL,     ADD COLUMN application_id BIGINT NOT NULL,     ADD COLUMN txn_id BIGINT NOT NULL,     ADD COLUMN op_id BIGINT NOT NULL,     ADD COLUMN op_type VARCHAR(255) NOT NULL,     ADD COLUMN product_id BIGINT NOT NULL,     ADD COLUMN cost_price DECIMAL(10, 2),  -- Nullable price field     ADD COLUMN is_active BOOLEAN NOT NULL,     ADD COLUMN variant_options JSON,  -- To store the variant configuration data     ADD COLUMN store_id BIGINT,  -- Store ID (nullable)      -- Adding foreign key constraint without cascading rules     ADD FOREIGN KEY (product_id) REFERENCES shop.product(id)	Error Code: 3780. Referencing column 'product_id' and referenced column 'id' in foreign key constraint 'variants_ibfk_1' are incompatible.	0.000 sec




ALTER TABLE shop.variants
    ADD COLUMN s_created_by VARCHAR(255) NOT NULL,
    ADD COLUMN s_updated_by VARCHAR(255) NOT NULL,
    ADD COLUMN s_created_at DATETIME NULL,
    ADD COLUMN s_updated_at DATETIME NULL,
    ADD COLUMN is_deleted BOOLEAN NOT NULL,
    ADD COLUMN row_version VARCHAR(255),
    ADD COLUMN s_created_ip VARCHAR(255),
    ADD COLUMN s_updated_ip VARCHAR(255),
    ADD COLUMN account_id BIGINT NOT NULL,
    ADD COLUMN application_id BIGINT NOT NULL,
    ADD COLUMN txn_id BIGINT NOT NULL,
    ADD COLUMN op_id BIGINT NOT NULL,
    ADD COLUMN op_type VARCHAR(255) NOT NULL,
    ADD COLUMN cost_price DECIMAL(10, 2),  -- Nullable price field
    ADD COLUMN is_active BOOLEAN NOT NULL,
    ADD COLUMN variant_options JSON,  -- To store the variant configuration data
    ADD COLUMN store_id BIGINT,  -- Store ID (nullable)
    
    -- Adding foreign key constraint without cascading rules
    ADD FOREIGN KEY (product_id) REFERENCES shop.product(id);

*/



// ALTER TABLE shop.variants
//     ADD COLUMN s_created_by VARCHAR(255),  -- Removed NOT NULL constraint
//     ADD COLUMN s_updated_by VARCHAR(255),  -- Removed NOT NULL constraint
//     ADD COLUMN s_created_at DATETIME,  -- Default is NULL
//     ADD COLUMN s_updated_at DATETIME,  -- Default is NULL
//     ADD COLUMN is_deleted BOOLEAN,  -- Removed NOT NULL constraint
//     ADD COLUMN row_version VARCHAR(255),  -- Nullable by default
//     ADD COLUMN s_created_ip VARCHAR(255),  -- Nullable by default
//     ADD COLUMN s_updated_ip VARCHAR(255),  -- Nullable by default
//     ADD COLUMN account_id BIGINT,  -- Removed NOT NULL constraint
//     ADD COLUMN application_id BIGINT,  -- Removed NOT NULL constraint
//     ADD COLUMN txn_id BIGINT,  -- Removed NOT NULL constraint
//     ADD COLUMN op_id BIGINT,  -- Removed NOT NULL constraint
//     ADD COLUMN op_type VARCHAR(255),  -- Nullable by default
//     ADD COLUMN cost_price DECIMAL(10, 2),  -- Nullable price field
//     ADD COLUMN is_active BOOLEAN,  -- Removed NOT NULL constraint
//     ADD COLUMN variant_options JSON,  -- Nullable by default
//     ADD COLUMN store_id BIGINT;  -- Nullable by default

// CREATE TABLE shop.product (
//     id INT AUTO_INCREMENT unique,
//     name VARCHAR(255),
//     description TEXT,
//     tax_category_id INT,
//     status VARCHAR(50),
//     store_id INT,
//     taxonomy_id INT,
//     price DECIMAL(10, 2),
//     files JSON,
//     is_single_variant BOOLEAN,
//     is_preference BOOLEAN,
//     modifier JSON
// );
