require('dotenv').config();

module.exports = {
  mysql: {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'myuser',
    password: process.env.MYSQL_PASSWORD || 'mypassword',
    database: process.env.MYSQL_DATABASE || 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};
