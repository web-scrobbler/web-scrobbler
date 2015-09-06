module.exports = function(driver, connector) {
	describe(connector.label, function() {

		siteSpec.shouldLoad(driver, "http://8tracks.com/action_hank/make-it-fun-kay");

        thisPage.waitAndClick(driver, {css: "#play_overlay"});

    	connectorSpec.shouldRecogniseATrack(driver, false);

	});
};
