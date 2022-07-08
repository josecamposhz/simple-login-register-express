// Rutas de la API
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = Router();

const secret_key = "secret_key";

const requiresAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Falta el token");

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).send("Token invalido");
    }
    req.user = decoded;
    next();
  });
};

router.get('/users', requiresAuth, async (req, res) => {
  console.log(req.user.id);
  const users = await db.getUsers();
  res.status(200).send(users);
}
);

// AXIOS POST (/api/users, { email, password })
router.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("El email es requerido");
    if (!password) return res.status(400).send("La contraseña es requerida");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.createUser({ email, password: passwordHash });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("El email es requerido");
    if (!password) return res.status(400).send("La contraseña es requerida");

    // obtener el usuario a partir del correo
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).send("Credenciales invalidas");
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).send("Credenciales invalidas");
    }

    const token = jwt.sign({ id: user.id, email }, secret_key);
    delete user.password;

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST enviamos información (payload) => se registre en la DB
// PUT enviamos información (payload) => se actualiza en la DB
// GET parametros de la ruta (req.params) o query params (req.query) => GET /rut?rut=123131464 o /rut/:rut :rut


// Cliente (HTML) => Servidor (Express) => DB (PG)

module.exports = router;