var express = require("express");
var router = express.Router();

const mysql = require("mysql");
const config = require("../dataBase/config");

const multer = require('multer')
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });


// 创建数据库连接
// 登录接口
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  const connection = mysql.createConnection(config);


  connection.connect();
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    function (error, results, fields) {
      if (error) {
        connection.end(function (err) {
          if (err) {
            console.error("Error closing database connection: " + err.stack);
            return;
          }
          console.log("Disconnected from MySQL database");
        });
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        res.json({ message: "用户不存在", status: false });
        connection.end(function (err) {
          if (err) {
            console.error("Error closing database connection: " + err.stack);
            return;
          }
          console.log(1111);
        });
        return;
      }

      const user = results[0];
      const hashedPassword = user.password;

      if (password == hashedPassword) {
        connection.query(
          "SELECT * FROM user WHERE username = ?",
          [username],
          function (err, results, fields) {
            connection.end(function (err) {
              if (err) {
                console.error(
                  "Error closing database connection: " + err.stack
                );
                return;
              }
              console.log("Disconnected from MySQL database");
            });
            res.json({ message: "登陆成功", data: results[0], status: true });
          }
        );
      } else {
        connection.end(function (err) {
          if (err) {
            console.error("Error closing database connection: " + err.stack);
            return;
          }
          console.log("Disconnected from MySQL database");
          res.json({ message: "登陆失败,账号或者密码不对" });
        });
      }
    }
  );
});

router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;
  const connection = mysql.createConnection(config);
  connection.connect();

  try {
    // 查询数据库中是否已存在相同用户名的用户
    connection.query(
      "SELECT * FROM user WHERE username = ?",
      [username],
      async function (error, results, fields) {
        if (error) {
          // 关闭数据库连接
          connection.end();
          console.error("Error during database query:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // 如果数据库中已存在相同用户名的用户，返回错误信息
        if (results.length > 0) {
          // 关闭数据库连接
          connection.end();
          return res.json({ message: "用户已存在", status: false });
        }
        connection.query(
          "INSERT INTO user (username, password) VALUES (?, ?)",
          [username, password],
          function (error, results, fields) {
            if (error) {
              console.error("Error during database query:", error);

              return res.status(500).json({ error: "Internal Server Error" });
            }
            // 注册成功，返回成功信息
            // 关闭数据库连接
            connection.end();
            res.json({ message: "注册成功", status: true });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
  const userId = req.body.user_id;
  const file = req.file;

  // 更新数据库中用户表的某个字段，这里假设字段名为avatar
  // 假设您使用Mongoose来操作MongoDB
  let sql = "UPDATE user SET avatar = ? WHERE id = ?"
  const avatar = '/uploads/' + file.filename;
  const connection = mysql.createConnection(config);


  connection.connect();

  connection.query(
    sql,
    [avatar, userId],
    async function (error, results, fields) {
      if (error) {
        // 关闭数据库连接
        connection.end();
        console.error("Error during database query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      connection.end();

      return res.json({ message: "success", data: avatar, status: true });

    }
  );

});

module.exports = router;
