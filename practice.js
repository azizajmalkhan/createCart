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

