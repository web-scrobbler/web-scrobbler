module.exports = function (driver, connector, next) {

	var url = 'https://www.youtube.com/watch?v=YqeW9_5kURI';
	before('should load ' + url, function (done) {
		siteSpec.shouldLoad(driver, url, done);
	});
	it('should load page: ' + url, function (done) {
		done();
	})
	describe('Loaded website', function () {
		connectorSpec.shouldRecogniseATrack(driver);
	});

	describe('Playlist videos', function() {
		async.each([ // From https://github.com/david-sabata/web-scrobbler/pull/755#issue-104480950
			{ url: 'https://youtube.com/watch?v=iyMZl8glVYw',	 comment: 'gets artist from YouTube title, tracks from playlist' },
			{ url: 'https://youtube.com/watch?v=N-3qILKnSrM',	 comment: 'HH:MM:SS timestamps' },
			{ url: 'https://youtube.com/watch?v=EzjX0QE_l8U',	 comment: 'compilation of different artistTrack' },
			{ url: 'https://youtube.com/watch?v=YKkOxFoE5yo',	 comment: 'enclosed timestamps + manual timestamp recognition' },
			{ url: 'https://youtube.com/watch?v=VFOF47nalCY',	 comment: 'funky HTML entities + false-positive artistTrack ID\'ing' },
			{ url: 'https://youtube.com/watch?v=RW3li2XWgoM',	 comment: 'strange jumble of number, timestamp, track name' },
			{ url: 'https://youtube.com/watch?v=i5mQ_m5zm6U',	 comment: 'PRESERVE lots of numbers all over the place' },
			{ url: 'https://youtube.com/watch?v=4Xg1usuLpsM',	 comment: 'Gets playlist from a comment' },
			{ url: 'https://www.youtube.com/watch?v=9-NFosnfd2c', comment: 'Removes ridiculous other duration timestamps' }
		], function(playlistVideo, nextPlaylist) {
			describe('Video: '+playlistVideo.url, function() {
				before('should load '+playlistVideo.url, function(done) {
					siteSpec.shouldLoad(driver, playlistVideo.url, done);
				});
				connectorSpec.shouldRecogniseATrack(driver);

				describe('playlist recognition', function() {
					before('should recognise playlist', function(done) {
						helpers.promiseScroll(driver, {y: 6000}, done); // to load comments that may contain user-submitted playlists
					})
					connectorSpec.shouldRecogniseAPlaylist(driver, {'comment': playlistVideo.comment });
				})

				after(function() { nextPlaylist(); });
			});
		});

		describe('Invalid playlists', function() {
			async.each([ // From https://github.com/david-sabata/web-scrobbler/pull/755#issue-104480950
				{ url: 'https://youtube.com/watch?v=EfcY9oFo1YQ', comment: 'incorrect timestamps => invalid playlist' },
				{ url: 'https://youtube.com/watch?v=YqeW9_5kURI', comment: 'a normal, single-track video' }
			], function(playlistVideo, nextPlaylist) {
				describe('Video: '+playlistVideo.urk, function(descriptionDone) {
					before('should load '+playlistVideo.url, function(done) {
						siteSpec.shouldLoad(driver, playlistVideo.url, done);
					});
					describe('playlist recognition', function() {
						before('should recognise playlist', function(done) {
							helpers.promiseScroll(driver, {y: 6000}, done); // to load comments that may contain user-submitted playlists
						})
						connectorSpec.shouldRecogniseAPlaylist(driver, {'comment': playlistVideo.comment, 'invert': true, 'timeout': 30 });
					})

					after(function() { nextPlaylist(); });
				})
			});
		});

		after(function() { next(); });
	});
};
