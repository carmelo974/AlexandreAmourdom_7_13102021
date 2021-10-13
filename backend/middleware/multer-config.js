// package qui permet de gérer les téléchargements de fichiers
const multer = require("multer");

// MIME permet de définir le format des images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

// storage indique a multer où enregister les fichiers images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  // filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    // dictionnaire type MIME pour résoudre l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    // timestamp date.now comme nom de fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");