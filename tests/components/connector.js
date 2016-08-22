'use strict';

/* global helpers, siteSpec, connectorSpec */

module.exports.shouldRecogniseATrack = function(driver, opts) {
	opts = opts || {};
	it(opts.comment ? opts.comment : 'should recognise a playing song', !opts.optional ? function(done) {

		helpers.listenFor(driver, 'connector_state_changed', function(res) {
			var song = res.data;

			// Improvement flags
			if(!song.trackArt) {
				helpers.devInfo('No trackArt');
			}
			if(!song.uniqueID) {
				helpers.devInfo('No uniqueID');
			}

			// Validate
			if(song.artist && song.track || song.artistTrack) {
				return valid();
			} else if(song.isPlaying) {
				return invalid(new Error('Connector sent null track data'));
			}
		}, function() {
			return invalid(new Error('Connector did not send any track data to core :('));
		}, opts.timeout || 50);

		function valid() {
			return done();
		}

		function invalid(err) {
			return done(err);
		}

	} : null);

};

module.exports.loadPlayListen = function(driver, next, url, btnSelector, opts) {
	before('should load '+url, function(done) {
		siteSpec.shouldLoad(driver, url, done, opts && opts.load ? opts.load : null);
	});

	it('should load page: '+url, function(done) { done(); });

	describe('Loaded website', function() {
		before('Play a track', function() {
			return helpers.promiseClick(driver, {css: btnSelector});
		});
		it('should play a song', function(done) { done(); });

		connectorSpec.shouldRecogniseATrack(driver, opts);
	});

	after(function() { next(); });
};

module.exports.loadSite = function(driver, next, url, opts) {
	before('should load ' + url, function(done) {
		siteSpec.shouldLoad(driver, url, done, opts && opts.load ? opts.load : null);
	});

	it('should load page: ' + url, function(done) {
		done();
	});

	after(function() {
		next();
	});
};
