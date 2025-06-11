const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'express-ui',
  brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092','kafka-broker-3:9092']
});

const producer = kafka.producer();

exports.index = (req, res) => {
  res.render('kafka', { status: '', title: 'Kafka UI' });
};

exports.sendMessage = async (req, res) => {
  const { topic, message } = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
    res.render('kafka', { status: 'Message sent!', title: 'Kafka UI' });
  } catch (err) {
    res.render('kafka', { status: 'Error sending message: ' + err.message, title: 'Kafka UI' });
  }
};
