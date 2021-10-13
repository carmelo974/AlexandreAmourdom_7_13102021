const passwordSchema = require("../models/password");

// vérifiez si le mdp correspnd au schéma
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "Votre mot de passe doit avoir au moins 10 caractères, avec une majuscule, une minuscule et un chiffre au moins.",
    });
  } else {
    next();
  }
};