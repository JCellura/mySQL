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
  supervisor();
});

function supervisor() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: 'Menu:',
      choices: [
        'View Product Sales by Department',
        'Create New Department',
        new inquirer.Separator(),
        'Exit Bamazon Supervisor'
      ]
    }
  ]).then(inq => {
    if (inq.manager === 'View Product Sales by Department') {
      productSales();
      setTimeout(supervisor, 500);
    }
    else if (inq.manager === 'Create New Department') {
      newDept();
    }
    else {
      connection.end();
    }
  });
}

function newTable() {
  delete tbl;
  tbl = new Table({ head: ['Dept ID', 'Dept Name', 'Overhead $', 'Product Sales $', 'Total Profit $'] });
}

function query() {
  connection.query(sql, function(err, res) {
    if (err) throw err;

    res.forEach(function(bam) {
      tbl.push(
        [
          bam.department_id, bam.department_name,
          bam.over_head_costs, bam.product_sales, bam.TotalProfit
        ]
      );
    });
    console.log('\n' + tbl.toString() + '\n');
  });
}

function productSales() {
  newTable();
  sql = 'SELECT * FROM totalprofits';
  query();
}

function newDept() {
  console.log('\r');
  inquirer.prompt([
    {
      type: 'input',
      name: 'deptName',
      message: 'Department name:',
      // validate: isNotEmpty
    },
    {
      type: 'input',
      name: 'overhead',
      message: 'Overhead costs:',
      validate: isValidQuantity
    }
  ]).then(inq => {
    connection.query(
      "INSERT INTO departments SET ?",
      {
        department_name: inq.deptName,
        over_head_costs: inq.overhead
      },
      function(err) {
        if (err) throw err;

        setTimeout(productSales, 500);
        setTimeout(supervisor, 1500);
      }
    );
  });
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