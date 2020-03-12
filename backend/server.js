const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(cors());

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aa12345!!",
  database: "Iptable"
});

connection.connect(err => {
  if (err) {
    console.log("error!!!!!");
    throw err;
  }
  console.log("you are now connected with mysql db");
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

var server = app.listen("3305", "localhost", () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address());
  console.log("app listening at http//%s:%s", host, port);
});

app.get("/", (req, res) => {
  connection.query("select * from ips", (error, results) => {
    if (error) throw error;
    console.log("server gives data to frontend.");
    res.end(JSON.stringify(results));
  });
});

app.get("/:exportFile"),
  (req, res) => {
    console.log("inside");
    connection.query(
      "select ipAddr from ips where isBlack = 1",
      (error, results) => {
        if (error) {
          console.log("error");
          throw error;
        }
        console.log("server send exported file");
        console.log(results);
      }
    );
  };

app.post("/", (req, res) => {
  let data = {
    ipAddr: req.body.ipAddr,
    inputDate: req.body.inputDate,
    memo: req.body.memo,
    isBlack: req.body.isBlack
  };
  console.log("new row added: ", data);
  let sql = "insert into ips set ?";
  connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
    console.log("Added rows: ", results.affectedRows);
  });
});

app.delete("/", (req, res) => {
  let data = { ipAddr: req.query.data };
  console.log("ipAddr: ", data);

  let query = `delete from ips where ipAddr = '${data.ipAddr}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log("Deleted Row(s): ", results.affectedRows);
  });
});

app.put("/", (req, res) => {
  let memo = req.body.data.memo;
  let ip = req.body.data.ipAddr;

  let query = `update ips set memo = '${memo}' where ipAddr = '${ip}'`;
  console.log("row updated: ", ip);
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log("Row affected: ", results.affectedRows);
  });
});

app.put("/:Modal", (req, res) => {
  let memo = req.body.data.memo;
  let isBlack = req.body.data.isBlack === false ? 0 : 1;
  let ip = req.body.data.ipAddr;

  let query = `update ips set memo = '${memo}', isBlack = '${isBlack}' where ipAddr = '${ip}'`;
  console.log("row updated: ", ip);
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log("Row affected: ", results.affectedRows);
  });
});
