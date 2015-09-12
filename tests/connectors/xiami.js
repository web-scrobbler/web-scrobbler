module.exports = function(driver, connector, next) {

	console.warn("            Xiami is not globally accessible - cannot reliably test for load");
	next();

	/* TODO:
	 * "Not allowed in your country"
	 - we need tests that can recognise stuff.
	 - graceful failure, not outright. Try { } catch { }
	*/

	// connectorSpec.loadPlayListen(driver, next,
	// 	'http://www.xiami.com/play',
	// 	'#J_nextBtn'
	// );

};
