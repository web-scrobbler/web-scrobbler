module.exports.shouldLoad = function(driver, url, done) {

	var pageLoad = true;

	if(url) {
		// /*#*/ console.log("Loading "+url);
		pageLoad = false;
		helpers.getAndWait(driver, url)
		.then(function() {
			pageLoad = true;
		})
		.thenCatch(function(err) {
			return done(new Error('Driver timeout!'));
		});
	}

	driver.wait(function() { return pageLoad; })
	.then(function() {
		helpers.alertCheck(driver).then(function() {
			// console.log('Alert check done!\nStarting waitforload');
			helpers.waitForLoad(driver)
			.then(function() {
				// console.log('Wait for load done!\nInjecting test capture.');
				helpers.injectTestCapture(driver).then(function() {
					helpers.waitForExtensionLoad(driver, {count: 0})
					.then(function(result) {
						/*#*/ console.info('		Extension loaded!');
						//expect(result).to.be.true;
						if(!result) return done(new Error('Extension load error!'));
						// cb();
						done();
					}, function(err) {
						/*#*/ console.warn('Extension error: ', err);
						return done(err);
					});
				});
			}, function(err) {
				/*#*/ console.warn('Driver Timeout!', err);
				return done(err);
			});
		});
	});
};
