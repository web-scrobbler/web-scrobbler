module.exports = function(driver, connector, next) {
	var url = 'http://www.bbc.co.uk/radio/player/bbc_6music';

	before('should load '+url, function(done) {
		siteSpec.shouldLoad(driver, url, done);
	});
	it('should load page: '+url, function(done) { done(); })

	describe('Loaded website', function() {
		connectorSpec.shouldRecogniseATrack(driver, 120, true);
	});

	after(function() { next(); });
};
