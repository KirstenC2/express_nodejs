const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'express-ui-consumer',
  brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092', 'kafka-broker-3:9092']
});

const consumer = kafka.consumer({ groupId: 'express-group' });

async function startConsumer() {
  await consumer.connect();
  // You can subscribe to any topic you want, or make this configurable
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Consumed message: ${message.value.toString()} from ${topic}[${partition}]`);
    },
  });
}

startConsumer().catch(console.error);
