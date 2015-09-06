var webdriver = require('selenium-webdriver');
var NUM_RETRY = 4;

module.exports.shouldRecogniseATrack = function(driver, cb) {

	it(NUM_RETRY, 'should recognise a playing song', function(done) {

		helpers.listenFor(driver, "connector_state_changed", function(res) {
			console.log(res,"Found track data, and sent it to core :)");
			done();
			cb();
		}, function(res) {
			console.log(res,"FAIL")
			done(new Error("Connector did not send any track data to core :("));
			cb();
		}, 50);

    });

};
