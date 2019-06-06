const express = require('express')
const router = express.Router()

router.post('/create', (req, res) => {
  res.send('okay')
})

module.exports = router
