'use strict';

const APP_ID = '158049',
    APP_KEY = '7863c187e6febe91f49a',
    APP_SECRET = '5ed61eb941698a61c2bd';

var cp     = require('child_process'),
	assert = require('assert'),
	connector;

describe('Connector', function () {
	this.slow(5000);

	after('terminate child process', function () {
		connector.kill('SIGKILL');
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			assert.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						app_id : APP_ID,
                        app_key : APP_KEY,
                        app_secret : APP_SECRET,
                        default_channel : 'default-channel',
                        default_event : 'default-event',
                        default_message : 'This is a default message from Pusher Connector.'
					}
				}
			}, function (error) {
				assert.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
                    channel : 'test-channel',
                    event : 'test-event',
                    message : 'This is a test message from Pusher Connector.'
				}
			}, done);
		});
	});
});