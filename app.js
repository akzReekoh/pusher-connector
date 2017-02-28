'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isEmpty = require('lodash.isempty')
let isPlainObject = require('lodash.isplainobject')
let domain = require('domain')
let pusherClient = null

let sendData = (data, callback) => {
  let d = domain.create()

  d.once('error', (error) => {
    callback(error)
    d.exit()
  })

  d.run(() => {
    if (isEmpty(data.channel)) { data.channel = _plugin.config.defaultChannel }

    if (isEmpty(data.event)) {
      data.event = _plugin.config.defaultEvent
    }

    if (isEmpty(data.message)) {
      data.message = _plugin.config.defaultMessage
    }

    pusherClient.trigger(data.channel, data.event, {
      message: data.message
    })

    _plugin.log(JSON.stringify({
      title: 'Pusher Message Sent.',
      data: data
    }))

    callback()
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let Pusher = require('pusher')

  pusherClient = new Pusher({
    appId: _plugin.config.appId,
    key: _plugin.config.appKey,
    secret: _plugin.config.appSecret,
    encrypted: true
  })

  _plugin.log('Pusher Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
