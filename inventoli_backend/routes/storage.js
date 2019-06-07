const express = require('express')
const router = express.Router()

router.post('/createContainer', (req, res) => {
  console.log('recieve');
  res.send('okay')
})

router.get('/test', (req, res) => {
  console.log('recieve');
  res.send('okay')
})

module.exports = router
