module.exports = function(driver, connector) {
	describe('Connector', function() {

		describe('Website', function() {
			siteSpec.shouldLoad(driver, 'http://8tracks.com/action_hank/make-it-fun-kay');
		});
		
		thisPage.promiseClick(driver, {css: '#play_overlay'})
			.then(function() {
				connectorSpec.shouldRecogniseATrack(driver);
			});
	});
};
