// models/transactionModel.js
const db = require('../service/db');

exports.addTransaction = async (userId, type, amount, description) => {
  await db.query(
    'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)',
    [userId, type, amount, description]
  );
};

exports.getTransactionsByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ?', [userId]);
  return rows;
};
