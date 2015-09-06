var webdriver = require('selenium-webdriver');

module.exports.shouldRecogniseATrack = function(driver, timeout, optional) {

	it('should recognise a playing song', !optional ? function(done) {

		helpers.listenFor(driver, 'connector_state_changed', function(res) {
			return done();
		}, function(res) {
			return done(new Error('Connector did not send any track data to core :('));
		}, timeout || 50);

	} : null);

};
