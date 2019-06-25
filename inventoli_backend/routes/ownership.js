const express = require('express')
const router = express.Router()
const Owners = require('../models/owners')

router.get('/getOwners/:house_id', (req, res) => {
  let { house_id } = req.params
  return Owners
  .query()
  .where({ house_id })
  .then(owners => {
    res.send(owners)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router
