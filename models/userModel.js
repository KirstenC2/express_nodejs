const db = require('../service/db');

exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

exports.addUser = async (name, email) => {
  await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
};

exports.deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};
