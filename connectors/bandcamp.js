/**
 * Improved Bandcamp Scrobbler by Malachi Soord.
 *
 * - Build on the work of George Pollard
 * - Inspired by the Spotify scrobbler
 */

$(function() {
	'use strict';

	$(document).ready(function() {

		/**
		 * Audio player reference.
		 */
		var player = null;

		/**
		 * Duration selector.
		 *
		 * @type {string}
		 */
		var durationPart = '.track_info .time';

		/**
		 * Duration regex.
		 *
		 * @type {string}
		 */
		var durationRegex = /[ \n]*(\d+):(\d+)[ \n]*\/[ \n]*(\d+):(\d+)[ \n]*/;

		/**
		 * Last playing track.
		 *
		 * @type {string}
		 */
		var lastTrack = null;

		/**
		 * If true then we are on a 'discovery' type of page.
		 *
		 * @type {boolean}
		 */
		var onDiscovery = $('#discover').length > 0;

		/**
		 * To determine whether the current page is an album.
		 *
		 * @type {boolean}
		 */
		var isAlbum = $('.trackView[itemtype="http://schema.org/MusicAlbum"]').length > 0;

		/**
		 * To determine whether the current page is a compilation or not.
		 *
		 * @type {Boolean}
		 */
		var isCompilation = isAlbum && allTracksDashed();

		console.log('BandCampScrobbler: Loaded! onDiscovery:' + onDiscovery + ' isAlbum:' + isAlbum + ' isCompilation:' + isCompilation);

		/**
		 * Bind listeners to the audio player that has been triggered.
		 */
		$('audio').bind('DOMSubtreeModified', function(event) {
			console.log('BandCampScrobbler: audio DOMSubtreeModified');

			/**
			 * Detach listeners from old player.
			 */
			if (player !== null) {
				console.log('BandCampScrobbler: removing existing listeners');
				player.removeEventListener('playing', scrobble);
				player.removeEventListener('ended', reset);
				player.removeEventListener('pause', reset);
			}

			var newPlayer = event.currentTarget;

			newPlayer.addEventListener('playing', scrobble);
			newPlayer.addEventListener('ended', reset);
			newPlayer.addEventListener('pause', reset);

			player = newPlayer;
		});

		/**
		 * Scrobble function
		 */
		var scrobble = function() {
			console.log('BandCampScrobbler: audio playing event!');

			var artist = parseArtist();
			var track = parseTitle();
			var album = parseAlbum();

			/**
			 * Work out artist from the track if either:
			 *
			 *  - The artist is set to 'Various' or 'Various Artists' and track has a dash
			 *  - This is a compilation
			 */
			var dashIndex = track.indexOf('-');
			if ((/^Various(\sArtists)?$/.test(artist) && dashIndex > 0) || isCompilation) {
				artist = track.substring(0, dashIndex);
				track = track.substring(dashIndex + 1);
			}

			console.log('BandCampScrobbler: attempting - Artist: ' + artist + '; Album:  ' + album + '; Track: ' + track);

			if (track !== lastTrack) {

				var duration = parseDuration();

				console.log('BandCampScrobbler: scrobbling - Artist: ' + artist + '; Album:  ' + album + '; Track: ' + track + '; duration: ' + duration.total);

				lastTrack = track;

				chrome.runtime.sendMessage({
					type: 'validate',
					artist: artist,
					track: track
				}, function(response) {
					if (response !== false) {
						chrome.runtime.sendMessage({
							type: 'nowPlaying',
							artist: response.artist,
							track: response.track,
							duration: duration.total,
							album: album
						});
					} else {
						chrome.runtime.sendMessage({
							type: 'nowPlaying',
							duration: duration.total
						});
					}
				});
			}
		};

		/**
		 * Set lastTrack to null to reset playing and enabling re-scrobbling
		 * of the same song again once audio has finished playing.
		 */
		var reset = function() {
			console.log('BandCampScrobbler: reset');
			lastTrack = null;
			chrome.runtime.sendMessage({
				type: 'reset'
			});
		};

		/**
		 * Parse artist information.
		 */
		function parseArtist() {
			var artist;
			if (onDiscovery) {
				artist = $('.detail_item_link_2').text();
			} else {
				var byLine = '';
				if (isAlbum) {
					byLine = $('dt.hiddenAccess:contains("band name") ~ dd').text();
				} else {
					byLine = $('.albumTitle nobr').text();
				}

				artist = $.trim($.trim(byLine).substring(2));
				if (!artist) {
					artist = $('span[itemprop=byArtist]').text();
				}
			}

			return $.trim(artist);
		}

		/**
		 * Parse album information.
		 */
		function parseAlbum() {
			var album;

			if (onDiscovery) {
				album = $('.detail_item_link').text();
			} else {
				if (isAlbum) {
					album = $('h2.trackTitle').text().trim();
				} else { // isTrack
					album = $('[itemprop="inAlbum"] [itemprop="name"]').text();
				}
			}

			return $.trim(album);
		}

		/**
		 * Parse title information.
		 */
		function parseTitle() {
			var title;
			if (onDiscovery) {
				title = $('.track_info .title').first().text();
			} else {
				if (isAlbum) {
					title = $('.track_info .title').first().text();
				} else {
					title = $('.trackTitle').first().text();
				}
			}

			return $.trim(title);
		}

		/**
		 * Parse duration information.
		 */
		function parseDuration() {
			try {
				var m = durationRegex.exec($(durationPart).text());
				return {
					current: parseInt(m[1], 10) * 60 + parseInt(m[2], 10),
					total: parseInt(m[3], 10) * 60 + parseInt(m[4], 10)
				};
			} catch (err) {
				return 0;
			}
		}

		/**
		 * Check to see if all tracks are dashed.
		 *
		 * @return bool the result
		 */
		function allTracksDashed() {
			var allDashed = true;

			$('.track_list span[itemprop="name"]').each(function() {
				if ($(this).text().indexOf('-') === -1) {
					allDashed = false;
					return false; // Break out loop
				}
			});

			return allDashed;
		}
	});

	// bind page unload function to discard current 'now listening'
	cancel();

	function cancel() {
		$(window).unload(function() {
			// reset the background scrobbler song data
			chrome.runtime.sendMessage({
				type: 'reset'
			});
			return true;
		});
	}
});
