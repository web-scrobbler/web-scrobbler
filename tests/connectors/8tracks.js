module.exports = function(driver, connector, next) {
	var url = 'http://8tracks.com/action_hank/make-it-fun-kay';

	before('should load', function(done) {
		siteSpec.shouldLoad(driver, url, done);
	});
	it('should actually load', function(done) { done(); })

	describe('Loaded website', function() {
		before('Play a track', function() {
			return thisPage.promiseClick(driver, {css: '#play_overlay'});
		})
		it('should play a song', function(done) { done(); })

		connectorSpec.shouldRecogniseATrack(driver);
	});

	after(function() { next(); });
};
