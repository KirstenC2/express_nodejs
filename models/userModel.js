const db = require('../service/db');

exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

exports.addUser = async (name, email) => {
  const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  return result.insertId; // return the new user's id
};

exports.deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};
