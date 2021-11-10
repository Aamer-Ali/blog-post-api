const connection = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  connection.query(
    "SELECT * FROM tbl_CategoryMaster",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

module.exports = router;
