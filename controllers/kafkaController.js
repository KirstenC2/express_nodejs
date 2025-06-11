const producer = require('../service/kafkaProducer');

let consumedMessages = [];

exports.index = (req, res) => {
  res.render('kafkaProducer', { status: '', title: 'Kafka Producer UI', messages: consumedMessages });
};


exports.sendMessage = async (req, res) => {
  const { topic, userId, type, amount, description, name, email, message } = req.body;
  let msgToSend = message;
  // If transaction fields are present, send as transaction JSON
  if (userId && type && amount) {
    msgToSend = JSON.stringify({ userId, type, amount, description });
  } else if (name && email) {
    msgToSend = JSON.stringify({ name, email });
  }
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: msgToSend }],
    });
    res.redirect('/kafka/producer');
  } catch (err) {
    res.render('kafkaProducer', { status: 'Error sending message: ' + err.message, title: 'Kafka Producer UI', messages: consumedMessages });
  }
};

// Export a function to add consumed messages
exports.addConsumedMessage = (msg) => {
  consumedMessages.push(msg);
  if (consumedMessages.length > 20) consumedMessages.shift(); // keep only last 20
};
