const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); // Importer le middleware CORS

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

const jwtUtils = require("jsonwebtoken"); // gestion des jwt
const JWT_SECRET = "azerty1234";

const bcrypt = require("bcrypt"); // gestion du hashage des mot de passe

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
  const token = req["headers"]["authorization"];
  const jwt = token.substring(7);

  jwtUtils.verify(jwt, JWT_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

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
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  connection.query(
    "SELECT * FROM user u WHERE u.email = ?",
    [req.body.email],
    async (erreur, lignes, champs) => {
      if (erreur) throw erreur;

      if (lignes.length > 0) {
        const motDePasseHashe = lignes[0].password;
        const motDePasseClair = req.body.password;

        const compatible = await bcrypt.compare(
          motDePasseClair,
          motDePasseHashe
        );

        if (compatible) {
          const jwt = jwtUtils.sign({ sub: req.body.email }, JWT_SECRET);
          res.send(jwt);
        } else {
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(403);
      }
    }
  );
});

app.post("/sign-in", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  connection.query(
    "INSERT INTO user (email, password, pseudo) VALUES (?,?,?) ",
    [req.body.email, hash, req.body.pseudo],
    (erreur, lignes, champs) => {
      if (erreur) throw erreur;

      res.sendStatus(201);
    }
  );
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
