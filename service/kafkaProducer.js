const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'express-ui',
  brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092', 'kafka-broker-3:9092']
});

const producer = kafka.producer();

module.exports = producer;
