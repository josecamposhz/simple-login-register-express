const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "proyecto",
  port: 5432,
});

const getUsers = async () => {
  const result = await pool.query("SELECT id, email FROM users");
  return result.rows;
}

const getUserByEmail = async (email) => {
  const result = await pool.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email]
  });
  return result.rows[0];
}

const createUser = async ({ email, password }) => {
  const result = await pool.query({
    text: "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *;",
    values: [email, password]
  })

  return result.rows[0];
}

module.exports = {
  getUsers,
  getUserByEmail,
  createUser
}