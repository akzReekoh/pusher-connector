'use strict'

const amqp = require('amqplib')

const APP_ID = '158049'
const APP_KEY = '7863c187e6febe91f49a'
const APP_SECRET = '5ed61eb941698a61c2bd'

let _channel = null
let _conn = null
let app = null

describe('Pusher Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      appId : APP_ID,
      appKey : APP_KEY,
      appSecret : APP_SECRET,
      defaultChannel : 'default-channel',
      defaultEvent : 'default-event',
      defaultMessage : 'This is a default message from Pusher Connector.'
    })
    process.env.INPUT_PIPE = 'ip.pusher'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        channel : 'test-channel',
        event : 'test-event',
        message : 'This is a test message from Pusher Connector.'
      }

      _channel.sendToQueue('ip.pusher', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
