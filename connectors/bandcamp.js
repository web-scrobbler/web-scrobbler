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
		var player = document.getElementsByTagName('audio')[0];

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
		 * Initial bind of listeners.
		 */
		player.addEventListener('playing', scrobble);
		player.addEventListener('ended', reset);

		/**
		 * Audio is already playing on visit so scrobble.
		 */
		if (!player.paused) {
			scrobble();
		}

		/**
		 * Scrobble function
		 */
		function scrobble() {
			console.log('BandCampScrobbler: scrobble!');

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
		}

		/**
		 * Set lastTrack to null to reset playing and enabling re-scrobbling
		 * of the same song again once audio has finished playing.
		 */
		function reset() {
			console.log('BandCampScrobbler: reset');
			lastTrack = null;
			chrome.runtime.sendMessage({
				type: 'reset'
			});
		}

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

			return cleanUpMatched(artist);
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

			return cleanUpMatched(album);
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

			return cleanUpMatched(title);
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

		/**
		 * Clean up matched text.
		 * @param  string input to clean up
		 * @return string cleaned up matched text
		 */
		function cleanUpMatched(input) {
			if (input === null) {
				return input;
			}
			input = stripZeroWidthChars(input);
			return $.trim(input);
		}

		/**
		 * Strip zero width characters.
		 * @param  string input to clean up
		 * @return string stripped input
		 */
		function stripZeroWidthChars(input) {
			return input.replace(/[\u200B-\u200D\uFEFF]/g, '');
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
