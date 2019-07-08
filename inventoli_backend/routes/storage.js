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
  .eager('items.owners')
  .then(([container]) => {
    if (container.items.length > 0) {
      container.items.forEach(data => {
        data['owner'] = data.owners[0]
        delete data['owners']
      })
    }
    res.send(container)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

router.put('/updateLocation', (req, res) => {
  let { location, id } = req.body

  return Containers
  .query()
  .patchAndFetchById(id, {location})
  .then(container => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
})

router.put('/updateContainer', (req, res) => {
  let { id, location, rfid_tag, items, itemsToDelete } = req.body

  return Containers
  .query()
  .patchAndFetchById(id, {location})
  .then(container => {
    if (items.length > 0) {
      items.forEach(data => {
        let { description, categories, certainty, images, owner } = data
        if (data.id) {
          return Items
          .query()
          .patchAndFetchById(data.id, {description, categories, certainty, images})
          .then(newItem => {
            if (!ObjectHelper.isEmpty(owner)) {
              if (owner.name === 'Not Sure') {
                return Owners_Items
                .query()
                .delete()
                .where({item_id: data.id})
                .then(deletedItem => {
                })
                .catch(err => console.log(err))
              }
              else {
                return Owners_Items
                .query()
                .where({item_id: data.id})
                .then(owner_items => {
                  if (owner_items.length === 0) {
                    return Owners_Items
                    .query()
                    .insert({owner_id: owner.id, item_id: data.id})
                  }
                  else {
                    return Owners_Items
                    .query()
                    .patchAndFetchById(owner_items[0].id, {owner_id: owner.id})
                  }
                })
              }
            }
          })
        }
        else {
          return Items
          .query()
          .insert({ description, categories, certainty, images, container_id: id })
          .then(newItem => {
            let item_id = newItem.id
            if (!ObjectHelper.isEmpty(data.owner)) {
              return Owners_Items
              .query()
              .insert({ owner_id: data.owner.id, item_id})
            }
          })
        }
      })
    }
    if (itemsToDelete) {
      if (itemsToDelete.length > 0) {
        itemsToDelete.forEach(itemToDelete => {
          if (!ObjectHelper.isEmpty(itemToDelete.owner)) {
            if (itemToDelete.owner.name === 'Not Sure') {
              console.log(itemToDelete);
              console.log('no Owner', itemToDelete.id);
              return Items
              .query()
              .delete()
              .where({id: itemToDelete.id})
              .then(deletedItem => {
                console.log(deletedItem);
              })
            }
            else {
              console.log('got owner');
              return Owners_Items
              .query()
              .delete()
              .where({item_id: itemToDelete.id})
              .then(deletedOwner_Item => {
                return Items
                .query()
                .delete()
                .where({id: itemToDelete.id})
              })
            }
          }
        })
      }
    }

    res.sendStatus(200)
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
