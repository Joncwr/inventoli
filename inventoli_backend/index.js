require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

const Api = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


app.use('/api', Api)
app.get('/online', (req, res) => {
  res.send('online')
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!!!!`));
