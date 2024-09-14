const mysql = require("../services/server");

const getall = (req, res) => {
  const query = "SELECT id,email,fname,lname,role FROM users";
  mysql.query(query, (err, result) => {
    if (err) return res.status(500).json({ err });
    if (result.length === 0)
      return res.status(404).json({ msg: "no data kub pom" });
    res.status(200).json({ result: result });
    res.end();
  });
};

const deleteuser = (req, res) => {
  const query = "DELETE FROM users where id = ?";
  const id = req.params.id;
  mysql.query(query, [id], (err) => {
    if (err) res.json({ msg: err });
    res.status(200).json({ msg: "Delete Success" });
    res.end();
  });
}

module.exports = { getall,deleteuser};
