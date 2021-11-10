const jwt = require("jsonwebtoken");
const connection = require("../connection");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res) => {
  connection.query("SELECT * FROM tbl_User", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

router.post("/", async (req, res) => {
  try {
    connection.query(
      "call SP_REGISTER_NEW_USER(?,?,?)",
      [req.body.username, req.body.email, req.body.password],
      function (err, result) {
        if (err) {
          console.log("err:", err);
        } else {
          console.log(result);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3),
    password: Joi.string().min(3),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      data: "",
      error: "Please provide proper username and password",
    });
  }

  try {
    connection.query(
      "CALL SP_USER_LOGIN(?,?);",
      [req.body.username, req.body.password],
      function (err, result) {
        if (err) {
          console.log("err:", err);
        } else {
          console.log("result:", result);
          const userId = result[0][0]["user_id"];

          if (userId == 0)
            return res.status(404).json({
              status: false,
              data: "",
              error: "No User found with this details",
            });

          const token = jwt.sign(
            {
              id: result[0][0]["user_id"],
              name: result[0][0]["username"],
              first_name: result[0][0]["first_name"],
              last_name: result[0][0]["last_name"],
              email: result[0][0]["email"],
              profile_pic: result[0][0]["profile_pic"],
            },
            "jwtPrivateKey"
          );
          return res.json({
            status: true,
            data: token,
            error: "",
          });
        }
      }
    );
    // connection.query(
    //   "SET @yes_no = null; CALL SP_USER_LOGIN(?,?,@yes_no); SELECT @yes_no;",
    //   [req.body.username, req.body.password, 0],
    //   function (err, result) {
    //     if (err) {
    //       console.log("err:", err);
    //     } else {
    //       const isExists = result[2][0]["@yes_no"];
    //       if (isExists == 0)
    //         return res.status(404).json({
    //           status: false,
    //           message: "",
    //           error: "No User found with this details",
    //         });

    //       const token = jwt.sign(
    //         { name: "aamer", email: "aamer@yes_no" },
    //         "jwtPrivateKey"
    //       );
    //       console.log(token);

    //       return res.json({
    //         status: true,
    //         message: "Login Successfully",
    //         error: "",
    //       });
    //     }
    //   }
    // );
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  connection.query(
    "CALL SP_UPDATE_USER_BY_ID(?,?,?,?,?);",
    [
      req.params.id,
      req.body.username,
      req.body.first_name,
      req.body.last_name,
      req.body.email,
    ],
    function (err, result) {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("result:", result[0][0]);
        // const userId = result[0][0]["user_id"];

        // if (userId == 0)
        //   return res.status(404).json({
        //     status: false,
        //     data: "",
        //     error: "No User found with this details",
        //   });

        const token = jwt.sign(
          {
            id: result[0][0]["user_id"],
            name: result[0][0]["username"],
            first_name: result[0][0]["first_name"],
            last_name: result[0][0]["last_name"],
            email: result[0][0]["email"],
            profile_pic: result[0][0]["profile_pic"],
          },
          "jwtPrivateKey"
        );
        return res.json({
          status: true,
          data: token,
          error: "",
        });
      }
    }
  );
});

module.exports = router;
