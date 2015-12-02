# Pusher Connector
[![Build Status](https://travis-ci.org/Reekoh/puhser-connector.svg)](https://travis-ci.org/Reekoh/puhser-connector)
![Dependencies](https://img.shields.io/david/Reekoh/puhser-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/puhser-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Pusher Connector plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with Pusher to send notifications.

## Description
This plugin sends messages/data from connected devices to the Reekoh Instance to Pusher.

## Configuration
To configure this plugin a Pusher account and application is needed in order to provide the following:

1. Application ID - The Pusher Application ID to use.
2. Application Key -  The corresponding Pusher Application Key.
3. Application Secret - The corresponding Pusher Application Secret.

Other Parameters:

1. Default Channel - The default channel to use.
2. Default Event - The default event to trigger.
3. Default Message - The default message to send.

These parameters are then injected to the plugin from the platform.

## Sample input data
```
{
    channel : 'test-channel',
    event : 'test-event',
    message : 'This is a test message from Pusher Connector.'
}