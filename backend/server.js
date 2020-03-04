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

app.post("/", (req, res) => {
  let data = { ipAddr: req.body.ipAddr, inputDate: req.body.inputDate };

  let sql = "insert into ips set ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});
