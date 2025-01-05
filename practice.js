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
