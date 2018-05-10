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
  customerView();
});

function customerView() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'customer',
      message: 'Menu:',
      choices: [
        'View Products for Sale',
        new inquirer.Separator(),
        'Exit Bamazon Customer'
      ]
    }
  ]).then(inq => {
    if (inq.customer === 'View Products for Sale') {
      checkout();
    }
    else {
      connection.end();
    }
  });
}

function checkout() {
  delete tbl;
  tbl = new Table({ head: ['ID', 'Name', 'Price $'] });

  connection.query(
    'SELECT item_id, product_name, price FROM products',
    function(err, res) {
      if (err) throw err;

      res.forEach(function(bam) {
        tbl.push(
          [
            bam.item_id, bam.product_name, bam.price.toFixed(2)
          ]
        );
      });

      console.log('\n' + tbl.toString() + '\n');
      
      connection.query('SELECT COUNT(*) FROM products;', function(err, res) {
        rowCount = parseInt(Object.values(res[0]));
    
        inquirer.prompt([
          {
            type: 'input',
            name: 'chooseId',
            message: 'Product ID to purchase:',
            validate: isValidId
          }
        ]).then(inq => {
          var item = inq.chooseId;

          inquirer.prompt([
            {
              type: 'input',
              name: 'chooseQuantity',
              message: 'Number of units to purchase:',
              validate: isValidQuantity
            }
          ]).then(inq => {
            var quantity = inq.chooseQuantity;
    
            connection.query(
              'SELECT * FROM products WHERE ?', {item_id: item},
              function(err, res) {
                if (err) throw err;
    
                var bamazon = res[0];
    
                if (bamazon.stock_quantity - quantity < 0) {
                  console.log('Insufficient stock!\n');
                  setTimeout(checkout, 500);
                } else {              
                    total = parseFloat(bamazon.price * quantity);

                    // Need to query the departments table first so we can update it in the callback function
                    connection.query('Select * FROM departments', function(err, res) {

                        //update the departments and updates the sale total for the id of the item purchased
                        connection.query("UPDATE departments SET product_sales = ? WHERE department_name = ?;", [res[0].product_sales + total, res[0].department_name], function(err, resultOne){
                            if(err) console.log('error: ' + err);
                            return resultOne;
                        });

                    });
    
                    var updateStock = 'UPDATE products SET stock_quantity = ' +
                        (bamazon.stock_quantity - quantity) + ', product_sales = ' +
                        (total + bamazon.product_sales) + ' WHERE item_id = ' + item;

                    connection.query(updateStock, function(err) {
                        if (err) throw err;
        
                        console.log('\n' + bamazon.product_name + ', $' + bamazon.price +
                        '\nQuantity: ' + quantity +
                        '\nTotal before tax: $' + total.toFixed(2) + '\n');
        
                        setTimeout(customerView, 500);
                  });
                }
              }
            );
          });
        });
      });
    }
  );
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