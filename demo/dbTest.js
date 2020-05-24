
//MySql Module
var mysql = require('mysql');

// Connexion à la base de données
var con = mysql.createConnection({
  host: "10.194.69.15",
  user: "g1",
  password: "XyNFK1br8uvvb9IS",
  database: "g1"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  // Questionner la BDD 
  con.query("SELECT * FROM joueur", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });

// Ajouter qqch à la BDD
  /*var sql = "INSERT INTO joueur (id_joueur, pseudo, mdp) VALUES ('5', 'juju', 'testmdp2')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });*/

});