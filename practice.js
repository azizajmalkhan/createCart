const loginController = require("./loginController");
let db;  // Declare a variable to hold the DB connection
 
// This method sets the DB connection
 function setDb(connection) {
   db = connection;
 }
 
// Function to query the DB asynchronously
// function queryAsync(sql, params) {
//     return new Promise((resolve, reject) => {
//         db.query(sql, params, function (err, results) {
//             if (err) {
//                 console.error('Query failed:', err);
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }
 
// Define a single function to handle both variants and modifiers
const createCart = async (req, res) => {
    try{
        

    let modifiers = [{
        "modifier_id": 1,
        "modifier_price": 20
    },
    {
        "modifier_id": 2,
        "modifier_price": 20
    },
    {
        "modifier_id": 3,
        "modifier_price": 20
    },
    {
        "modifier_id": 4,
        "modifier_price": 20
    }]
    let variants = [{
        "variant_id": 1,
        "variant_price": 100
    }, {
        "variant_id": 2,
        "variant_price": 100
    }, {
        "variant_id": 3,
        "variant_price": 100
    }, {
        "variant_id": 4,
        "variant_price": 100
    }]


    let tax_data = [{
        "tax_id": 1,
        "percentage": 10
    }, {
        "tax_id": 2,
        "percentage": 20
    }]
    console.log(tax_data);
    
    let reqq;
    if (typeof req.body === 'string') {
        reqq = JSON.parse(req.body);
    } else {
        reqq = req.body;
    }
    console.log(reqq);

    //console.log(subTotal(reqq,variants,modifiers));
    var total_price = 0
    total_price = subTotal(reqq, variants, modifiers)

     console.log(total_price);
console.log(taxTotal(total_price, reqq.data, tax_data, reqq.data.is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data));

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
    function taxTotal(total_price,initial_data, tax_data, is_coupon_applied, coupon_data, is_reward_redeemed, redeem_data) {
 
        let tax_sub_total = 0;
        if (initial_data && tax_data) {
            if (initial_data && initial_data.order_details.length > 0) {
                initial_data.order_details.forEach(function (initial) {
                    tax_data.forEach(function (tax) {
                        if (initial.tax_id == tax.tax_id) {
                            let product_share = (total_price > 0) ? (Number(initial.price) * Number(initial.quantity) / total_price) : 0
                            let discounted_price = applyDiscount(product_share, initial.price, initial.quantity)
                            tax_sub_total += calculateTax(discounted_price, tax.percentage)
                            if (initial.selected_options && initial.selected_options && initial.selected_options[0].modifiers.length > 0) {
                                initial.selected_options[0].modifiers.forEach(function (option_modifiers) {
                                    tax_data.forEach(function (tax_data) {
                                        if (tax_data.tax_id == option_modifiers.tax_id) {
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
                                if (tax.tax_id == prd_modifiers.tax_id) {
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









// -- Create a database named 'shop'
// CREATE DATABASE shop;

// -- Show the databases to confirm it has been created
// SHOW DATABASES;

// -- Select the 'shop' database
// -- USE shop;

// -- Create a 'products' table in the 'shop' database
// CREATE TABLE shop.products (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     quantity INT DEFAULT 0
// );


// update delete colmns
// _--------------------

// -- ALTER TABLE shop.modifiers 
// -- ADD COLUMN tax_category_id BIGINT NOT NULL;
// -- ALTER TABLE shop.tax 
// -- DROP COLUMN tax_category_id;

// -- INSERT INTO shop.tax (name, tax_price) 
// -- VALUES ("ten%", 10);
// -- UPDATE shop.modifiers
// -- SET tax_category_id = 10
// -- WHERE id = 1;

// -- UPDATE shop.variants
// -- SET tax_category_id = 1
// -- WHERE id IN (1,2,5);









// CREATE TABLE shop.products (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     quantity INT DEFAULT 0
// );


// CREATE TABLE shop.variants (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     quantity INT DEFAULT 0
// );


// CREATE TABLE shop.modifiers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     quantity INT DEFAULT 0
// );


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
//     id INT AUTO_INCREMENT,  -- Kept AUTO_INCREMENT for id, but removed PRIMARY KEY
//     s_created_at DATETIME,
//     s_updated_at DATETIME,
//     is_deleted BOOLEAN,
//     op_id INT,
//     op_type VARCHAR(255),
//     name VARCHAR(255),
//     description TEXT,
//     tax_category_id INT,
//     meta_title VARCHAR(255),
//     status VARCHAR(50),
//     store_id INT,
//     taxonomy_id INT,
//     option_type_ids JSON,
//     barcode VARCHAR(255),
//     service_type VARCHAR(255),
//     price DECIMAL(10, 2),
//     files JSON,
//     industry_id INT,
//     stock INT,
//     is_single_variant BOOLEAN,
//     is_preference BOOLEAN,
//     barcode_type VARCHAR(50),
//     modifier JSON,
//     PRIMARY KEY (id)  -- Re-added PRIMARY KEY for the id column
// );



// CREATE TABLE shop.tax (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100),
//     tax_price DECIMAL(10, 2)
// );




// CREATE TABLE shop.variants (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100),
//     price DECIMAL(10, 2),
//     quantity INT
// );


// CREATE TABLE shop.modifiers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100),
//     price DECIMAL(10, 2),
//     quantity INT
// );

// -- CREATE TABLE shop.tax (
//     --     id INT AUTO_INCREMENT PRIMARY KEY,
//     --     name VARCHAR(100),
//     --     tax_price DECIMAL(10, 2)
//     -- );
//     -- INSERT INTO shop.tax (name, tax_price)
//     -- VALUES
//     --     ('Sales Tax', 5.00),
//     --     ('VAT', 8.50);
    
//     -- INSERT INTO shop.variants (name, price, quantity)
//     -- VALUES
//     --     ('T-shirt', 19.99, 100),
//     --     ('Jeans', 39.99, 50);
    
//     -- INSERT INTO shop.modifiers (name, price, quantity)
//     -- VALUES
//     --     ('Extra Cheese', 2.50, 200),
//     --     ('Spicy Sauce', 1.50, 150);

/*

================================================================
debugging :
==============
first run :
step :1--node --inspect server.js   
step :2--open in chrome chrome://inspect/#devices	//Refresh the Page
step :3 -- search file using ctrl + p
step :4 -- put debugging point and hit on postman 

================================================================
Kill  port for debugging :
==================================

✅ Option 1: Kill the process using port 8081
On Windows (Command Prompt or PowerShell):

netstat -ano | findstr :8081

You’ll get output like:

TCP    127.0.0.1:8081      0.0.0.0:0              LISTENING       <PID>
Take the PID (e.g., 12345) and kill it:

Edit
taskkill /PID 12345 /F*/
