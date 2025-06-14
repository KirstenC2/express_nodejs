const transactionRepository = require('../repositories/transactionRepository');

exports.allTransactionsUI = async (req, res) => {
  try {
    const userHistory = await transactionRepository.getAllTransactions();
    res.render('transactions', { userHistory });
  } catch (err) {
    res.render('transactions', { userHistory: [], error: err.message });
  }
};

// 你也可以加上新增、刪除、查詢單一交易等功能