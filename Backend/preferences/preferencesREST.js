const httpCodes = require("../http/httpCodes");
const db = require("../db/connectionData");

const DBERROR = "Database Server Error";

function savePreferences(req, res) {
  const { username, ufos, time } = req.body;
  const mycon = db.doConnection();

  const query = `
    UPDATE prefView 
    SET ufos = ?, time = ?
    WHERE user = ?
  `;

  mycon.query(query, [ufos, time, username], (err, result) => {
    if (err) {
      console.error("Error saving preferences:", err);
      res.status(httpCodes.codes.SERVERERROR).send(DBERROR);
    } else {
      if (result.affectedRows > 0) {
        res.status(httpCodes.codes.OK).json("Preferences saved successfully");
      } else {
        res.status(httpCodes.codes.NOTFOUND).json("User not found");
      }
    }
    res.end();
  });

  db.closeConnection(mycon);
}

function findPreferences(req, res) {
  const username = req.params.username;

  const mycon = db.doConnection();

  const query = `
    SELECT ufos, time 
    FROM prefView 
    WHERE user = ?
  `;

  mycon.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error retrieving preferences:", err);
      res.status(httpCodes.codes.SERVERERROR).send(DBERROR);
    } else {
      if (result.length > 0) {
        res.status(httpCodes.codes.OK).json(result[0]);
      } else {
        res.status(httpCodes.codes.NOTFOUND).json("Preferences not found");
      }
    }
    res.end();
  });

  db.closeConnection(mycon);
}

module.exports = {
  savePreferences,
  findPreferences,
};
