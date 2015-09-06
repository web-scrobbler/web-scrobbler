module.exports = function(driver, connector, next) {

	var url = 'https://www.youtube.com/watch?v=YqeW9_5kURI';
	before('should load '+url, function(done) {
		siteSpec.shouldLoad(driver, url, done);
	});
	it('should load page: '+url, function(done) { done(); })
	describe('Loaded website', function() {
		connectorSpec.shouldRecogniseATrack(driver);
	});
};
