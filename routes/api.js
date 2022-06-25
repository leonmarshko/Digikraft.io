var express = require('express')
const StationController = require('../controllers/stationController')
var router = express.Router()

router.get('/stations/:at', StationController.getDataByDate)
router.get('/stations/:kioskid/:at', StationController.getDataByKioskId)

module.exports = router
