// const emailQueue = require("./Queues/OrderEmailQueue")
// //const emailQue = require("./Queues/OrderEmailQueue")

// emailQueue.add("1")




// const emailQueue = require("./Queues/OrderEmailQueue");

// emailQueue.add({ orderId: 1, email: "test@example.com" })
//   .then(job => {
//     console.log("✅ Job added to queue:", job.id);
//   })
//   .catch(err => {
//     console.error("❌ Failed to add job:", err);
//   });











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
