const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'express-ui-consumer',
  brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092', 'kafka-broker-3:9092']
});

const consumer = kafka.consumer({ groupId: 'express-group' });

async function startConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: 't', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = message.value.toString();
      if (onMessage) onMessage(msg);
      console.log(`Consumed message: ${msg} from ${topic}[${partition}]`);
    },
  });
}

module.exports = { consumer, startConsumer };
