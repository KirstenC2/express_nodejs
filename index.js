const express = require('express');
const path = require('path');
const routes = require('./routes');
const kafkaRoutes = require('./routes/kafka');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/kafka', kafkaRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});