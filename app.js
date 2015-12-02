'use strict';

var platform = require('./platform'),
    isEmpty = require('lodash.isempty'),
    isPlainObject = require('lodash.isplainobject'),
    domain = require('domain'),
    d = domain.create(),
	config,pusherClient;

platform.on('data', function (data) {
    d.once('error', function(error){
        console.error(error);
        platform.handleException(error);
        d.exit();
    });

    d.run(function(){
        if(isPlainObject(data)){
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
        }
        else
            platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
    });
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