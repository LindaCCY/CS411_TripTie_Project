var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const config = require("../dataBase/config");

/* GET home page. */
router.post('/add', function (req, res, next) {
  console.log(req.body);
  const { gender, birthday, date_interval_start, date_interval_end, about_myself, looking_for, user_id, city_location } = req.body;
  const connection = mysql.createConnection(config);
  connection.connect();

  connection.query(
    "INSERT INTO info (gender, birthday, date_interval_start, date_interval_end, about_myself, looking_for, user_id ,city_location) VALUES (?, ?,?, ?,?, ?,?,?)",
    [gender, birthday, date_interval_start, date_interval_end, about_myself, looking_for, user_id, city_location],
    function (error, results, fields) {
      if (error) {
        console.error("Error during database query:", error);

        return res.status(500).json({ error: "Internal Server Error" });
      }
      // 注册成功，返回成功信息
      // 关闭数据库连接
      connection.end();
      res.json({ message: "Success", status: true });
    }
  );
});


router.post('/search', function (req, res, next) {
  console.log(req.body);
  const { gender, date_interval_start, date_interval_end, city_location } = req.body;
  const connection = mysql.createConnection(config);
  connection.connect();

  connection.query(
    "SELECT * FROM info WHERE date_interval_start = ? AND date_interval_end = ? AND gender = ? AND city_location = ?",
    [date_interval_start, date_interval_end, gender, city_location],
    function (error, results, fields) {
      if (error) {
        console.error("Error during database query:", error);

        return res.status(500).json({ error: "Internal Server Error" });
      }
      // 注册成功，返回成功信息
      // 关闭数据库连接
      connection.end();
      res.json({ message: "Success", data: results, status: true });
    }
  );
});

module.exports = router;
