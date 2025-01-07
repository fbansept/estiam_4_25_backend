const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); // Importer le middleware CORS

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Activer CORS pour toutes les requêtes
app.use(cors());

app.get("/", (req, res) => {
  res.send("Le serveur marche, mais il y a rien à voir ici");
});

app.get("/posts", (req, res) => {
  const data = [
    {
      title: "Article 1",
      uri: "https://cdn.pixabay.com/video/2024/12/03/244754_large.mp4",
      author: {
        pseudo: "Tom",
        avatar: "https://placehold.jp/3d4070/ffffff/50x50.png"
      },
      like: 1123456,
      mediaKind: "movie"
    },
    {
      title: "Article 2",
      uri: "https://placehold.jp/200x500.png?text=PHOTO",
      author: {
        pseudo: "Titi",
        avatar: "https://placehold.jp/ab6742/ffffff/50x50.png"
      },
      like: 5678,
      mediaKind: "picture"
    }
  ];

  res.send(data);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
