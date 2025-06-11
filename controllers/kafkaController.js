const producer = require('../service/kafkaProducer');

let consumedMessages = [];

exports.index = (req, res) => {
  res.render('kafkaProducer', { status: '', title: 'Kafka Producer UI', messages: consumedMessages });
};


exports.sendMessage = async (req, res) => {
  const { topic, message } = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    res.render('kafkaProducer', { status: 'Message sent!', title: 'Kafka Producer UI', messages: consumedMessages });
  } catch (err) {
    res.render('kafkaProducer', { status: 'Error sending message: ' + err.message, title: 'Kafka Producer UI', messages: consumedMessages });
  }
};

// Export a function to add consumed messages
exports.addConsumedMessage = (msg) => {
  consumedMessages.push(msg);
  if (consumedMessages.length > 20) consumedMessages.shift(); // keep only last 20
};
