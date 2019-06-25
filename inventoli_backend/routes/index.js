const express = require('express')
const router = express.Router()

const StorageApi = require('./storage')
const OwnershipApi = require('./ownership')

router.use('/storage', StorageApi)
router.use('/ownership', OwnershipApi)

module.exports = router
