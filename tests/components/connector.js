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

module.exports.shouldRecogniseAPlaylist = function(driver, opts, cb) {
	var opts = opts || {};
	it(opts.comment ? opts.comment : 'should recognise a playlist of songs', !opts.optional ? function(done) {

		helpers.listenFor(driver, 'connector_got_playlist', function found(res) {
			(!opts.invert ? valid : invalid)(res)
		}, function notFound(res) {
			(!opts.invert ? invalid : valid)(res)
		}, opts.timeout || 50);

		function valid(res){
			if(cb) { cb(done) } else return done();
		}

		function invalid(res) {
			var err = new Error('Connector did not recognise a playlist :(')
			if(cb) { cb(done,err) } else return done(err);
		}

	} : null);

};

module.exports.loadPlayListen = function(driver, next, url, btnSelector, opts) {
	before('should load '+url, function(done) {
		siteSpec.shouldLoad(driver, url, done, opts.load);
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
