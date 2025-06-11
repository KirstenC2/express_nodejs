// scripts/seed.js
const userRepository = require('../repositories/userRepository');
const transactionRepository = require('../repositories/transactionRepository');

async function seed() {
  // Add fake users
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' }
  ];
  const userIds = [];
  for (const user of users) {
    const id = await userRepository.addUser(user.name, user.email);
    userIds.push(id);
    console.log(`Inserted user: ${user.name} (${user.email}) with id ${id}`);
  }

  // Add fake transactions
  const transactions = [
    { userId: userIds[0], type: 'deposit', amount: 1000, description: 'Initial deposit' },
    { userId: userIds[1], type: 'withdrawal', amount: 200, description: 'ATM withdrawal' },
    { userId: userIds[2], type: 'deposit', amount: 500, description: 'Paycheck' },
    { userId: userIds[0], type: 'withdrawal', amount: 100, description: 'Groceries' }
  ];
  for (const tx of transactions) {
    await transactionRepository.addTransaction(tx.userId, tx.type, tx.amount, tx.description);
    console.log(`Inserted transaction for user ${tx.userId}: ${tx.type} $${tx.amount}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
