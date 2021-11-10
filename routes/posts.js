const connection = require("../connection");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  connection.query("call SP_GET_ALL_POSTS()", function (err, result) {
    if (err) {
      console.log("err:", err);
    } else {
      console.log(result);
      res.send(result[0]);
    }
  });
});

router.get("/:id", async (req, res) => {
  connection.query(
    "call SP_GET_POST_BY_ID(?)",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        res.send(result[0][0]);
      }
    }
  );
});

router.get("/bycategory/:id", async (req, res) => {
  connection.query(
    "call SP_GET_POST_BY_CATEGORY(?)",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        res.send(result[0]);
      }
    }
  );
});

module.exports = router;
