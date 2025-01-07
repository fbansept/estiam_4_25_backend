const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); // Importer le middleware CORS

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Activer CORS pour toutes les requêtes
app.use(cors());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "estiam_4_25"
});

connection.connect();

app.get("/", (req, res) => {
  res.send("Le serveur marche, mais il y a rien à voir ici");
});

app.get("/posts", (req, res) => {
  connection.query(
    "SELECT * FROM post p JOIN user u ON p.author_id = u.id ",
    (erreur, lignes, champs) => {
      if (erreur) throw erreur;

      for (let ligne of lignes) {
        ligne.author = {
          pseudo: ligne.pseudo,
          avatar: ligne.avatar
        };
        ligne.likeCount = ligne.like_count;
        ligne.mediaKind = ligne.media_kind;
        delete ligne.pseudo;
        delete ligne.avatar;
        delete ligne.password;
        delete ligne.email;
        delete ligne.like_count;
        delete ligne.media_kind;
      }

      res.send(lignes);
    }
  );
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
