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
  ("MacBook Air", "Tech", 899.99, 50, 0),
  ("Playstation 4", "Tech", 299.95, 30, 0),
  ("XBOX ONEs", "Tech", 399.99, 20, 0),
  ("Apple Magic Mouse 2", "Tech", 79, 180, 0),
  ("IKEA Tertial Work Lamp", "Lighting", 34.99, 70, 0),
  ("Wood/Marble Sit/Stand Desk", "Office", 1299.99, 5, 0),
  ("Under Armor Climbing Shoes", "Outdoor", 130, 20, 0),
  ("Jordan 4 Basketball Shoes", "Basketball", 160, 30, 0),
  ("Lebron James Jersey", "Basketball", 100, 100, 0),
  ("Nike AirMax 95", "Running", 150, 50, 0);

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
  ("Tech", 8000),
  ("Lighting", 7000),
  ("Office", 6000),
  ("Outdoor", 2500),
  ("Basketball", 4000),
  ("Running", 6000);

SELECT * FROM departments;

-- This creates the alias table TotalProfits that will exist only when requested by the executive
SHOW TABLES;
CREATE VIEW bamazon.TotalProfits AS SELECT department_id, department_name, over_head_costs, product_sales, over_head_costs-product_sales AS TotalProfit FROM Departments;