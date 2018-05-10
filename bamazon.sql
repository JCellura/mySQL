DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(11,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(11,2) NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES
  ("IKEA Brada Laptop Support", "Tech", 4.99, 40, 0),
  ("Incase Laptop Sleeve", "Tech", 69.95, 55, 0),
  ("Vincent van Gogh Mousepad", "Tech", 9.99, 3, 0),
  ("Apple Magic Mouse 2", "Tech", 79, 180, 0),
  ("IKEA Tisdag Work Lamp", "Lighting", 39.99, 4, 0),
  ("IKEA Bekant Sit/Stand Desk", "Office", 499.99, 100, 0),
  ("Camelbak Chute 1L", "Outdoor", 14, 20, 0),
  ("Herschel Pop Quiz Backpack", "Outdoor", 74.99, 30, 0),
  ("Liverpool FC Home Shirt", "Soccer", 65, 200, 0),
  ("Adidas Ultraboost Shoes", "Running", 180, 25, 0);

SELECT * FROM products;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs DECIMAL(11,2) NULL,
  product_sales DECIMAL(11,2) NULL,
  total_profit DECIMAL(11,2) NULL
);

INSERT INTO departments (
  department_name, over_head_costs
)
VALUES
  ("Tech", 10000),
  ("Lighting", 2500),
  ("Office", 3300),
  ("Outdoor", 6500),
  ("Soccer", 8775),
  ("Running", 8250);

SELECT * FROM departments;