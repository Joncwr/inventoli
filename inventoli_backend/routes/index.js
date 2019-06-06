const express = require('express')
const router = express.Router()

const StorageApi = require('./storage')

router.use('/storage', StorageApi)

module.exports = router
