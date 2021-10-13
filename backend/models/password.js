const passwordValidator = require("password-validator");

// schema du mot de passe
const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(10) // longueur min
  .is()
  .max(100) // longueur max
  .has()
  .uppercase() // Doit avoir au moins une majuscule
  .has()
  .lowercase() // Doit avoir au moins une minuscule
  .has()
  .digits() // Doit avoir au moins un chiffre
  .has()
  .not()
  .spaces() // Ne doit pas avoir d'espace
  .is().not().oneOf(["Passw0rd", "Password123"]); // Mdp interdits

module.exports = passwordSchema;
