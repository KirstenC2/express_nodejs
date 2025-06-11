// repositories/transactionRepository.js
const transactionModel = require('../models/transactionModel');

exports.addTransaction = async (userId, type, amount, description) => {
  return await transactionModel.addTransaction(userId, type, amount, description);
};

exports.getTransactionsByUser = async (userId) => {
  return await transactionModel.getTransactionsByUser(userId);
};
