const express = require('express')
const router = express.Router()

const util = require('util')
const logger = require('../utils/logger')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const mailgun = require('mailgun-js')

const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

const webhookResponseController = require('../controllers/webhook-response')

router.post('/mailgun', urlencodedParser, function (request, response, next) {
  logger.info(util.inspect(request.body))

  if (!mailgunClient.validateWebhook(request.body.timestamp, request.body.token, request.body.signature)) {
    response.status(400).send('error')
  } else {
    webhookResponseController.create({
      data: request.body
    })
    .then(function () {
      response.status(200).send('ok')
    })
    .catch(function (err) {
      logger.error(err)
      response.status(500).send('Internal Server Error')
    })
  }
})

module.exports = router
