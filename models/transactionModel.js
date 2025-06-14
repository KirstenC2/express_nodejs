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



// 取得單一交易紀錄（依交易 id）
exports.getTransactionById = async (transactionId) => {
  const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [transactionId]);
  return rows[0];
};

// 取得某用戶的所有交易，依時間排序
exports.getUserTransactionHistory = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC',
    [userId]
  );
  return rows;
};