const mysql = require("../services/server.js");

const addproduct = (req, res) => {
  const query =
    "INSERT INTO products(product_name,description,price,stock_quantity) VALUES(?)";
  const data = [
    req.body.product_name,
    req.body.description,
    req.body.price,
    req.body.stock_quantity,
  ];
  const category_id = req.body.category_id;
  const sub_category = req.body.sub_category;
  mysql.query(query, [data], (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
};

module.exports = { addproduct };
