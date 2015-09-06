var webdriver = require('selenium-webdriver');
var NUM_RETRY = 4;

module.exports.shouldRecogniseATrack = function(driver) {

	it(NUM_RETRY, 'should recognise a playing song', function(done) {

		// Intercept track message
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			if(request.type === 'v2.stateChanged') {
				console.log("TRACKING_SONG", request.state);
				return done();
			}
		});

    });

};
