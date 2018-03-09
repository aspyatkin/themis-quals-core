// const logger = require('../utils/logger')
const request = require('request')

class TelegramController {
  static post (description, callback) {
    request({
      method: 'GET',
      url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ACCESS_TOKEN}/sendMessage`,
      qs: {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: description,
        parse_mode: 'Markdown'
      }
    }, function (error, response, body) {
      if (error) {
        callback(error)
      } else {
        callback(null)
      }
    })
  }
}

module.export = TelegramController