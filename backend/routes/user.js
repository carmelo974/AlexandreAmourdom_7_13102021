const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const checkPassword = require("../middleware/check-password");
const checkEmail = require("../middleware/check-email");

router.post("/signup", checkEmail, checkPassword, userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/me", auth, userCtrl.userProfil);
router.put("/update", auth, userCtrl.modifyUser);
router.delete("/delete/:id", auth, userCtrl.deleteUser);

module.exports = router;
