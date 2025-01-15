// exports.connectionData = {
//   host: "wd.etsisi.upm.es",
//   port: 3306,
//   user: "class",
//   password: "Class24_25",
//   database: "marsbd",
// };
const mysql = require("mysql");

exports.doConnection = function () {
  return mysql.createConnection({
    host: "wd.etsisi.upm.es",
    port: 3306,
    user: "class",
    password: "Class24_25",
    database: "marsbd",
  });
};

exports.closeConnection = function (connection) {
  connection.end((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
    }
  });
};
