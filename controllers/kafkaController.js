const producer = require('../service/kafkaProducer');

exports.index = (req, res) => {
  res.render('kafkaProducer', { status: '', title: 'Kafka Producer UI' });
};


exports.sendMessage = async (req, res) => {
  const { topic, message } = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    res.render('kafkaProducer', { status: 'Message sent!', title: 'Kafka Producer UI' });
  } catch (err) {
    res.render('kafkaProducer', { status: 'Error sending message: ' + err.message, title: 'Kafka Producer UI' });
  }
};
