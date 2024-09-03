const jwt = require('jsonwebtoken')
const token = (req, res) => {
  const token = req.headers["authorization"];
  const realToken = token && token.split(" ")[1];
  if (realToken == null) return res.status(401).json({ msg: "Unauthorize" });

  jwt.verify(realToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ msg: "Unauthorized" });
    res.json(decoded);
  });
};
module.exports = {token}
