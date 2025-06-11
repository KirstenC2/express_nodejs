const { Kafka } = require('kafkajs');
const userRepository = require('../repositories/userRepository');
const transactionRepository = require('../repositories/transactionRepository');

const kafka = new Kafka({
  clientId: 'express-ui-consumer',
  brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092', 'kafka-broker-3:9092']
});

const consumer = kafka.consumer({ groupId: 'express-group' });

async function startConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'registration', fromBeginning: true });
  await consumer.subscribe({ topic: 'transactions', fromBeginning: true });
  await consumer.subscribe({ topic: 'other', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = message.value.toString();
      if (onMessage) onMessage(msg);
      console.log(`Consumed message: ${msg} from ${topic}[${partition}]`);
      try {
        const data = JSON.parse(msg);
        if (topic === 'transactions' && data.userId && data.type && data.amount) {
          const users = await userRepository.getAllUsers();
          const userExists = users.some(u => u.id == data.userId);
          if (userExists) {
            await transactionRepository.addTransaction(data.userId, data.type, data.amount, data.description);
            console.log('Inserted transaction from Kafka message:', data);
          } else {
            console.error('Transaction insert failed: userId does not exist:', data.userId);
          }
        } else if (topic === 'registration' && data.name && data.email) {
          await userRepository.addUser(data.name, data.email);
          console.log('Inserted user from Kafka message:', data);
        } else {
          // For 'other' or unknown topic, just log
          console.log('Received message on topic', topic, ':', data);
        }
      } catch (err) {
        console.error('Failed to insert consumed message into MySQL:', err.message);
      }
    },
  });
}

async function startConsumerWithRetry(onMessage, retries = 100, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await startConsumer(onMessage);
      console.log('Kafka consumer started successfully.');
      break;
    } catch (err) {
      console.error(`Kafka consumer failed to start (attempt ${i + 1}):`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err;
    }
  }
}

module.exports = { consumer, startConsumer: startConsumerWithRetry };
