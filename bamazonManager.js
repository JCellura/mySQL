var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('\r');
  managerView();
});

function managerView() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: 'Menu:',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Increase Stock',
        'Add New Product',
        new inquirer.Separator(),
        'Exit Bamazon Manager'
      ]
    }
  ]).then(inq => {
    if (inq.manager === 'View Products for Sale') {
      viewProducts();
      setTimeout(managerView, 500);
    }
    else if (inq.manager === 'View Low Inventory') {
      lowInventory();
      setTimeout(managerView, 500);
    }
    else if (inq.manager === 'Increase Stock') {
      viewProducts();
      setTimeout(increaseStock, 500);
    }
    else if (inq.manager === 'Add New Product') {
      addProduct();
    }
    else {
      connection.end();
    }
  });
}

function newTable() {
  delete tbl;
  tbl = new Table({ head: ['ID', 'Name', 'Price $', 'Stock', 'Product Sales $'] });
}

function query() {
  connection.query(sql, function(err, res) {
    if (err) throw err;

    res.forEach(function(bam) {
      tbl.push(
        [
          bam.item_id, bam.product_name, bam.price.toFixed(2),
          bam.stock_quantity, bam.product_sales.toFixed(2)
        ]
      );
    });
    console.log('\n' + tbl.toString() + '\n');
  });
}

function viewProducts() {
  newTable();
  sql = 'SELECT item_id, product_name, price, stock_quantity, product_sales FROM products';
  query();
}

function lowInventory() {
  newTable();
  sql = 'SELECT item_id, product_name, price, ' +
    'stock_quantity, product_sales FROM products WHERE stock_quantity < 5';
  query();
}

function increaseStock() {
  connection.query('SELECT COUNT(*) FROM products;', function(err, res) {
    rowCount = parseInt(Object.values(res[0]));

    inquirer.prompt([
      {
        type: 'input',
        name: 'chooseId',
        message: 'Increase stock for product ID:',
        validate: isValidId
      }
    ]).then(inq => {
      console.log('\r');
      var item = inq.chooseId;
  
      inquirer.prompt([
        {
          type: 'input',
          name: 'chooseQuantity',
          message: 'Units to add:',
          validate: isValidQuantity
        }
      ]).then(inq => {
        quantity = inq.chooseQuantity;
  
        connection.query(
          'SELECT * FROM products WHERE ?', {item_id: item},
          function(err, products) {
            if (err) throw err;
            
            stockSum = parseInt(products[0].stock_quantity) +
              parseInt(quantity);
  
            updateStock = 'UPDATE products SET stock_quantity = ' +
              stockSum + ' WHERE item_id = ' + item;
  
            connection.query(updateStock, function(err) {
              if (err) throw err;
  
              if (quantity === '1') {
                console.log('\n' + quantity + ' unit added to ' +
                  products[0].product_name + '\n');
              } else {
                console.log('\n' + quantity + ' units added to ' +
                  products[0].product_name + '\n');
              }
            });
          }
        );
        setTimeout(managerView, 500);
      });
    });
  });
}

function addProduct() {
  console.log('\r');
  inquirer.prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'Product name:',
      // validate: isNotEmpty
    },
    {
      type: 'input',
      name: 'deptName',
      message: 'Department:',
      // validate: isNotEmpty
    },
    {
      type: 'input',
      name: 'price',
      message: 'Price:',
      // validate: isDecimal
    },
    {
      type: 'input',
      name: 'stock',
      message: 'Stock amount:',
      validate: isValidQuantity
    }
  ]).then(inq => {
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: inq.productName,
        department_name: inq.deptName,
        price: inq.price,
        stock_quantity: inq.stock,
        product_sales: 0
      },
      function(err) {
        if (err) throw err;

        setTimeout(viewProducts, 500);
        setTimeout(managerView, 1500);
      }
    );
  });
}

function isValidId(val) {
  var integer = Number.isInteger(parseFloat(val));
  var sign = Math.sign(val);

  if (integer && (sign === 1) && val > 0 && val <= rowCount) {
    return true;
  } else {
    return 'Please enter a valid ID.';
  }
}

function isValidQuantity(val) {
  var integer = Number.isInteger(parseFloat(val));
  var sign = Math.sign(val);

  if (integer && (sign === 1) && val > 0) {
    return true;
  } else {
    return 'Please enter a whole non-zero number.';
  }
}

// function isNotEmpty(val) {
// }

// function isDecimal(val) {
// }

// function deleteProduct() {
// }