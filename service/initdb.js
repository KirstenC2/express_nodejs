const db = require('./db');

async function initdb(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )`);
      await db.query(`CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);
      console.log('Users and transactions tables ensured.');
      return;
    } catch (err) {
      console.error(`DB init failed (attempt ${i + 1}):`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err;
    }
  }
}

module.exports = initdb;
