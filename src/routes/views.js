// Vistas de la Aplicación
const { Router } = require('express');

const router = Router();

router.get("/", (req, res) => {
  res.render("Home");
});

router.get("/login", (req, res) => {
  res.render("Login");
});

router.get("/register", (req, res) => {
  res.render("Register");
});

router.get("/private", (req, res) => {
  res.render("Private");
});

module.exports = router;