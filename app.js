'use strict';

var platform = require('./platform'),
    isEmpty = require('lodash.isempty'),
    isPlainObject = require('lodash.isplainobject'),
    isArray = require('lodash.isarray'),
    async = require('async'),
    domain = require('domain'),
	config,pusherClient;

let sendData = (data, callback) => {
    let d = domain.create();

    d.once('error', function(error){
        callback(error);
        d.exit();
    });

    d.run(() => {
        if(isEmpty(data.channel))
            data.channel = config.channel;

        if(isEmpty(data.event))
            data.event = config.event;

        if(isEmpty(data.message))
            data.message = config.message;

        pusherClient.trigger(data.channel, data.event, {
            message: data.message
        });

        platform.log(JSON.stringify({
            title: 'Pusher Message Sent.',
            data: data
        }));
    });
};

platform.on('data', function (data) {
    if(isPlainObject(data)){
        sendData(data, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else if(isArray(data)){
        async.each(data, (datum, done) => {
            sendData(datum, done);
        }, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    var Pusher = require('pusher');

    pusherClient = new Pusher({
        appId: options.app_id,
        key: options.app_key,
        secret: options.app_secret,
        encrypted: true
    });

    config = {
        channel: options.default_channel,
        event: options.default_event,
        message: options.default_message
    };

    platform.log('Pusher Connector Initialized.');
    platform.notifyReady();
});