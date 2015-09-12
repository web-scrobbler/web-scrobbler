var webdriver = require('selenium-webdriver');

module.exports.shouldRecogniseATrack = function(driver, opts) {
	var opts = opts || {};
	it(opts.comment ? opts.comment : 'should recognise a playing song', !opts.optional ? function(done) {

		helpers.listenFor(driver, 'connector_state_changed', function(res) {
			return done();
		}, function(res) {
			return done(new Error('Connector did not send any track data to core :('));
		}, opts.timeout || 50);

	} : null);

};

module.exports.loadPlayListen = function(driver, next, url, btnSelector, opts) {
	before('should load '+url, function(done) {
		siteSpec.shouldLoad(driver, url, done);
	});

	it('should load page: '+url, function(done) { done(); })

	describe('Loaded website', function() {
		before('Play a track', function() {
			return thisPage.promiseClick(driver, {css: btnSelector});
		})
		it('should play a song', function(done) { done(); })

		connectorSpec.shouldRecogniseATrack(driver, opts);
	});

	after(function() { next(); });
};
