const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("sequelize/types");
const checkPassword = require("../middleware/check-password");
const passwordSchema = require("../models/password");
const user = require("../models/user");
const User = require("../models/user");

// création d'un user
exports.signup = (req, res, next) => {
  // paramètre de la requête
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let bio = req.body.bio;

  if (email == null || username == null || password == null) {
    res.status(400).json({ error: "Veuillez remplir tous les champs 😅 " });
  }

  // Vérifier si user nexiste pas
  models.User.findOne({
    attributes: ["email"],
    where: { email: email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 10, function (err, bcryptPassword) {
          // création de l'user
          const newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptPassword,
            bio: bio,
            isAdmin: 0,
          })
            .then((newUser) => {
              res.status(201).json({ userId: newUser.id });
            })
            .catch((err) => {
              res.status(500).json({ err });
            });
        });
      } else {
        return res
          .status(409)
          .json({ error: "Cette utilisateur existe déjà 😓" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

//  login d'un user
exports.login = (req, res, next) => {
  // paramètres
  let username = req.body.username;
  let password = req.body.password;
  if (username == numm || password == null) {
    res.status(400).json({ error: "Veuillez remplir les champs 😉" });
  }

  // vérifier si l'user existe
  models.User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé!" });
      }
      // bcrypt compare le mdp
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: " mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// affichage d'un user
exports.userProfil = (req, res, next) => {
  let id = req.params.id;
  models.User.findOne({
    attributes: ["id", "email", "username", "bio", "isAdmin"],
    where: { id: id },
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json(error));
};

// supprimer un user
exports.deleteUser = (req, res) => {
  //récupération de l'id de l'user
  let userId = req.params.id;
  if (userId != null) {
    //Recherche sécurité si user existe bien
    models.User.findOne({
      where: { userId: userId },
    }).then((user) => {
      if (user != null) {
        //supprime mess/img
        models.Message.destroy({
          where: { userId: user.id },
        })
          .then(() => {
            console.log("Tous les messages de cet user ont été supprimé");
            //Suppression de l'utilisateur
            models.User.destroy({
              where: { id: user.id },
            })
              .then(() => res.end())
              .catch((err) => console.log(err));
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(401).json({ error: "Cette utilisateur n'existe pas " });
      }
    });
  } else {
    res.status(500).json({
      error: "Impossible de supprimer ce compte, contacter un administrateur",
    });
  }
};

// modification d'un user
exports.modifyUser = (req, res, next) => {
  const userId = req.params.id;
  const newPassword = req.body.password;
  // vérification regex
  console.log(passwordSchema(newPassword));
  if (passwordSchema(newPassword)) {
    models.User.findOne({
      where: { id: userId },
    })
      .then((user) => {
        bcrypt.compare(
          newPassword,
          user.password,
          (errComparePassword, resComparePassword) => {
            // si mdp identiquecil n'y aura aucun changement
            if (resComparePasssowrd) {
              res
                .status(405)
                .json({ error: " Vous avez entré  le même mot de passe!" });
            } else {
              bcrypt.hash(newPassword, 10, function (err, bcryptNewPassword) {
                models.User.update(
                  { password: bcryptNewPassword },
                  { where: { id: user.id } }
                )
                  .then(() =>
                    res
                      .status(201)
                      .json({ confirmation: "mot de passe modifié!" })
                  )
                  .catch((err) => res.status(500).json(err));
              });
            }
          }
        );
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(406).json({ error: "mot de passe non valide" });
  }
};
