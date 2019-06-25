const express = require('express')
const router = express.Router()
const ObjectHelper = require('../helpers/ObjectHelper')
const Containers = require('../models/containers')
const Items = require('../models/items')
const Owners_Items = require('../models/owners_items')

router.post('/createContainer', (req, res) => {
  let { rfid_tag, items } = req.body

  return Containers
  .query()
  .where({ rfid_tag })
  .then(container => {
    if (container.length === 0) {
      return Containers
      .query()
      .insert({ rfid_tag })
      .then(newContainer => {
        let container_id = newContainer.id
        items.forEach(item => {
          let { description, categories, certainty, images } = item
          return Items
          .query()
          .insert({ description, categories, certainty, images, container_id })
          .then(newItem => {
            let item_id = newItem.id
            if (!ObjectHelper.isEmpty(item.owner)) {
              return Owners_Items
              .query()
              .insert({ owner_id: item.owner.id, item_id})
            }
          })
        })

        res.sendStatus(200)
      })
      .catch(err => console.log(err))
    }
    else {
      res.send('Container already exists')
    }
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

router.get('/getContainer/:rfid_tag', (req, res) => {
  let { rfid_tag } = req.params
  return Containers
  .query()
  .where({ rfid_tag })
  .eager('items')
  .then(([container]) => {
    console.log(container);
    res.send(container)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

router.get('/test', (req, res) => {
  console.log('recieve');
  res.send('okay')
})

module.exports = router
