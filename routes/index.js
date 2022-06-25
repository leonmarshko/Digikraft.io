var express = require('express')
var apiRouter = require('./api')

var app = express()

app.use('/v1/', apiRouter)

module.exports = app
