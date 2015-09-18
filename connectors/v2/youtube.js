'use strict';

/* globals Connector, _ */

var scrobbleMusicOnly = false;
chrome.storage.local.get('Connectors', function(data) {
	if (data && data.Connectors && data.Connectors.YouTube) {
		var options = data.Connectors.YouTube;
		if (options.scrobbleMusicOnly === true) {
			scrobbleMusicOnly = true;
		}

		console.log('connector options: ' + JSON.stringify(options));
	}
});

/* State update hooks setup */

// Turns out that idling youtube pages update nothing but the video element.
var video = $('video').first();
if (video.length !== 0) {
	console.log('Found HTML5 video, hooking state change worker to it.');
	video.bind('playing pause timeupdate', Connector.onStateChanged);
} else {
	// Video element not found (no HTML5?), resort to using old selectors
	Connector.playerSelector = '#player-api';
	console.info('HTML5 video element not found, is it disabled? Using an old hooker instead.');
}

Connector.getCurrentTime = function () {
	if (video) {
		return video[0].currentTime;
	}
	var textSeconds = $('#player-api .ytp-time-current').text();
	return Connector.stringToSeconds(textSeconds) || null;
};

Connector.artistTrackSelector = '#eow-title';

Connector.durationSelector = '#player-api .ytp-time-duration';

Connector.getUniqueID = function() {
	var url = window.location.href;
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[7].length==11){
		return match[7];
	}
	return null;
};

Connector.isPlaying = function() {
	return (
		/* Can scrobble from any genre */ !scrobbleMusicOnly ||
		/* OR only music AND is music  */ ( scrobbleMusicOnly && $('meta[itemprop=\"genre\"]').attr('content') == 'Music' )
	)	? $('#player-api .html5-video-player').hasClass('playing-mode')
		: false;
};

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();
	var separator = Connector.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	if (artist === null) {
		// Use youtube copyright detector
		var $tags = $('ul.content.watch-info-tag-list').first();
		var tagtitle = $tags.prev('h4').text();
		artist = $tags.find('a').first().text();
		if ((artist.length === 0) || (artist == 'Google Play') || (!tagtitle.match(/^\s*music\s*$/i))) {
			artist = null;
		}
	}

	return {
		artist: cleanseArtist(artist),
		track: cleanseTrack(track)
	};
};

var timestampPattern = '[0-9]{0,2}:*[0-9]{1,2}:[0-9]{2}';
var timestampRegex = new RegExp(timestampPattern,'gi');

function findLongest(arrays) {
	if ((arrays === null) || (arrays.length === 0)) {
		return null;
	}
	// Select the longest playlist
	// Choose the second from the longest (youtube top comment)
	var streak = false;
	var longest = arrays.reduce(function(previous, current) {
		if (current !== null) {
			if (previous === null) {
				return current;
			}
			if (current.length == previous.length) {
				if (streak === true) {
					return previous;
				} else {
					streak = true;
					return current;
				}
			}
			if (current.length > previous.length) {
				streak = false;
				return current;
			}
		}
		return previous;
	});
	return longest;
}

// Run getPlaylist once very 3s, as it involves quite strenuous regex / jquery parsing of the DOM
// More to the point: the playlist only changes when the YT page does, so no point constantly scanning it.
Connector.setThrottleInterval(3000);

// Used to trigger the update after asyncFixAlbum fails.
Connector.forceUpdate = false;

Connector.getPageHash = function () {
	var force = Connector.forceUpdate ? '_forceUpdate' : '';
	Connector.forceUpdate = false;
	return Connector.getUniqueID() + $('#eow-description, .comment-text-content').length + force;
};

// Used for asynchronous collection of timestamp-less tracks
Connector.asyncPlaylistCache = {
	hash: '',
	finished: 0,
	busy: false,
	processed: false,
	playlist: [],
	callback: null,
	imprint: function () {
		this.hash = Connector.getUniqueID();
	},
	expired: function () {
		return (this.hash !== Connector.getUniqueID());
	},
	reset: function () {
		console.log('Flushing the fixed playlist cache.');
		this.playlist = [];
		this.finished = 0;
		this.processed = false;
		this.busy = false;
		this.callback = null;
		this.imprint();
	},
	await: function(num, onReady) {
		this.reset();
		if (num === 0) {
			return;
		}
		this.busy = true;
		this.playlist = new Array(num);
		this.playlist.forEach(function(item, index, array) {
			// This shuts up the linter but all we really want is to fill the array with nulls
			if (!item) {
				array[index] = null;
			}
		});
		this.callback = onReady;
	},
	push: function(index, value, hash) {
		if (hash && (this.hash !== hash)) {
			return;
		}
		if (!this.expired() && this.busy) {
			this.finished++;
		}
		this.playlist[index] = value;
		if ((this.finished === this.playlist.length) && !this.expired()) {
			if (this.busy && this.callback) { 
				this.processed = this.callback() ? true : false;
			}
			this.busy = false;
		}
	}
};

Connector.asyncAlbumCache = {
	hash: null,
	album: null,
	playlist: null,
	processed: false,
	busy: false,
	callback: null,
	imprint: function () {
		this.hash = Connector.getUniqueID();
	},
	expired: function () {
		return (this.hash !== Connector.getUniqueID());
	},
	await: function(onReady) {
		this.reset();
		this.busy = true;
		this.callback = onReady;
	},
	reset: function () {
		console.log('Flushing the fixed album cache.');
		this.playlist = null;
		this.album = null;
		this.processed = false;
		this.busy = false;
		this.imprint();
	},
	set: function(album, hash) {
		if (hash && (this.hash !== hash)) {
			return;
		}
		this.album = album;
		if (this.busy && this.callback) {
			if (!this.expired()) {
				this.processed = this.callback() ? true : false;
			}
		}
		this.busy = false;
	}
};

Connector.playlist = null;

Connector.fillTimestamps = function (playlist) {
	if ((playlist === null) || (playlist.length === 0)) {
		return null;
	}
	var missingTracks = 0;
	// Compute the overall duration and preliminary track timestamps
	var playlistTime = 0;
	playlist.forEach(function (track, index, array) {
		if ((track === null) || !track.duration) {
			missingTracks++;
			return;
		}
		array[index].startTime = playlistTime;
		playlistTime += track.duration;
	});
	if (playlistTime === 0) {
		console.info('Could not partition the playlist - combined track length is 0.');
		return null;
	}
	if (missingTracks === 0) {
		// Squeeze the tracks to match the playlist duration
		var scaleFactor = Connector.getDuration() / playlistTime;
		playlist.forEach(function (track, index, array) {
			array[index].startTime = track.startTime * scaleFactor;
		});
		console.log('Scaled the playlist (' + playlistTime + ') with a factor of ' + scaleFactor + ' to match the video duration.');
	} else {
		// Try to fill the gap from known Duration
		var gap = (Connector.getDuration() - playlistTime) / missingTracks;
		if (gap < 0) {
			console.info('Could not fill the playlist gap because the duration was already longer than expected.', playlist);
			return null;
		}
		playlistTime = 0;
		playlist.forEach(function (track, index, array) {
			if (track === null) {
				track = {
					artist: '',
					track: '',
					startTime: playlistTime,
					duration: gap
				};
				playlistTime += gap;
			} else if (!track.duration) {
				track.startTime = playlistTime;
				playlistTime += gap;
			} else {
				track.startTime = playlistTime;
				playlistTime += track.duration;
			}
			array[index] = track;
		});
		console.info('Guessed the duration of ' + missingTracks + ' playlist tracks lacking duration data.', playlist);
	}
	return playlist;
};

Connector.asyncFixAlbum = function (artist, album, compareTo) {
	var albumData = {
		artist: artist,
		album: album
	};
	var aac = Connector.asyncAlbumCache;
	aac.await(function processFixedAlbum() {
		var album = Connector.asyncAlbumCache.album;
		if (album === null) {
			console.log('Failed to fix an album. Forcing page update.');
			// Trigger onPageChanged to fix the playlist instead
			Connector.forceUpdate = true;
			return false;
		}
		var pl = Connector.fillTimestamps(album.tracks);

		if (pl !== null) {
			if (compareTo && (Math.abs(compareTo.length - pl.length) > 2)) {
				console.info('Using the original parsed playlist because the fixed album differs too much from it.', pl);
				Connector.asyncAlbumCache.playlist = compareTo;
				return true;
			}
			Connector.asyncAlbumCache.playlist = pl;
			console.log('Fixed an album.', pl);
			return true;
		}
		console.info('Failed to parse the fixed album.', pl);
		Connector.asyncAlbumCache.playlist = null;
		Connector.forceUpdate = true;
		return false;
	});
	var requestHashCopy = aac.hash.slice();
	var loadAlbumResponse = function (response) {
		aac.set(response, requestHashCopy);
	};
	chrome.runtime.sendMessage({
		type: 'v2.loadAlbumInfo',
		data: albumData,
		autocorrect: true
	}, loadAlbumResponse);
};

Connector.resetAsyncCaches = function() {
	Connector.asyncAlbumCache.reset();
	Connector.asyncPlaylistCache.reset();
};

// This is supposed to run on each page load and after the comments are loaded
Connector.onPageChanged = function () {
	console.log('Page changed, reparsing playlists');
	Connector.playlist = null;
	var playlists = Connector.buildPlaylists();
	if (playlists === null) {
		Connector.resetAsyncCaches();
		return;
	}

	if (playlists.timed !== null) {
		Connector.playlist = findLongest(playlists.timed);
		console.log('Parsed a timed playlist.', Connector.playlist);
		// this isn't needed but may reduce confusion if the logic is broken somewhere
		Connector.resetAsyncCaches();
		return;
	}

	var aac = Connector.asyncAlbumCache;
	var apc = Connector.asyncPlaylistCache;

	var numberedPlaylist = findLongest(playlists.numbered);
	if (numberedPlaylist !== null) {
		console.log('Parsed a numbered playlist.', numberedPlaylist);
		// This should only run once per video
		if (aac.expired()) {
			// Try to fix an album before getting trackinfo-crazy
			var artistAlbum = Connector.getArtistTrack();
			console.log('Trying to fix an album.');
			// If this succeeds, aac.processed should become true.
			// Otherwise it forces the update to get here again
			Connector.asyncFixAlbum(artistAlbum.artist, artistAlbum.track, numberedPlaylist);
		} else if (apc.expired()) {
			// Don't try to fix the playlist if we have a fixed album
			if (!aac.busy && !aac.processed) {
				// When this succeeds, apc.processed should become true.
				console.info('Trying to fetch track duration data from LastFM (can be slow).');
				Connector.asyncFixPlaylist(numberedPlaylist);
			}
		}
	}
};

// Asynchronously fills asyncPlaylistCache with fixed playlist data
Connector.asyncFixPlaylist = function (brokenPlaylist) {
	var apc = Connector.asyncPlaylistCache;
	if ((brokenPlaylist === null) || (brokenPlaylist.length === 0)) {
		console.info('Tried to fix an empty broken playlist');
		return null;
	}
	if (brokenPlaylist.length > 20) {
		console.info('The playlist is too long to fetch from LastFM.');
		// Actualize the asyncPlaylistCache to suppress playlist updates
		apc.reset();
		return null;
	}
	// The array length is used to check if all the responses are received.
	apc.await(brokenPlaylist.length, function onFixedPlaylistReady () {
		var apc = Connector.asyncPlaylistCache;
		if ((apc.playlist === null) || (apc.playlist.length === 0)) {
			console.info('Failed to fix a playlist.');
			return false;
		}
		var playlist = Connector.fillTimestamps(apc.playlist);
		if (playlist !== null) {
			apc.playlist = playlist;
			// Mark the playlist as ready to use
			return true;
		}
		return false;
	});
	var requestHashCopy = apc.hash.slice();
	brokenPlaylist.forEach(function (maybeTrack, index) {
		var artist = maybeTrack.artist;
		var track = maybeTrack.track;
		if ((artist === null) && (track === null)) {
			console.info('Playlist track #' + index + ' skipped because it does not contain enough info.');
			apc.push(index, null, requestHashCopy);
			return;
		}

		var maxRetries = 2;
		var numRetry = 0;
		var songData = {
			artist: artist,
			track: track
		};

		function loadSongResponse(song) {
			if (requestHashCopy != Connector.asyncPlaylistCache.hash) {
				console.info('Request hash mismatch - song info discarded.');
				return;
			}
			numRetry++;
			if (song === null) {
				if (numRetry <= maxRetries) {
					// Remove (remix) etc
					songData.artist = cleanseTrackHarder(maybeTrack.artist, numRetry + 1);
					songData.track = cleanseTrackHarder(maybeTrack.track, numRetry + 1);
					console.log('Playlist track #' + index + ': trying more agressive parsing (try ' + numRetry + '): ' + songData.artist + ' - ' + songData.track);
					loadSong(songData);
					// Don't remember this data
					return;
				} else {
					console.info('Playlist track #' + index + ' could not be fixed (try ' + numRetry + '): '  + songData.artist + ' - ' + songData.track);
				}
			} else {
				maybeTrack.artist = song.processed.artist;
				maybeTrack.track = song.processed.track;
				maybeTrack.duration = song.processed.duration;
				maybeTrack.album = song.processed.album;
				maybeTrack.startTime = 0; // computed in fillTimestamps
				if (song.processed.duration !== 0) {
					console.log('Playlist track #' + index + ' fixed. (try ' + numRetry + '): ' + maybeTrack.artist + ' - ' + maybeTrack.track);
				} else {
					console.info('Playlist track #' + index + ' was fixed but lacks duration data. (try ' + numRetry + '): ' + maybeTrack.artist + ' - ' + maybeTrack.track);
				}
			}
			apc.push(index, maybeTrack, requestHashCopy);
		}
		function loadSong(songData) {
			chrome.runtime.sendMessage({
				type: 'v2.loadSongInfo',
				data: songData,
				autocorrect: true
			}, loadSongResponse);
		}
		loadSong(songData);
	});
};

function cleanseTrackHarder(maybeTrack, hardness) {
	if (typeof maybeTrack === 'undefined' | maybeTrack === null) {
		return null;
	}
	var before = maybeTrack.slice();
	switch(hardness)
	{
		default:
		case 3:
			maybeTrack = maybeTrack.replace(/\(.*\)/, '');
			maybeTrack = cleansePlaylistLine(maybeTrack);
			maybeTrack = cleanseTrack(maybeTrack);
			break;
		case 2:
			maybeTrack = cleansePlaylistLine(maybeTrack);
			maybeTrack = cleanseTrack(maybeTrack);
			break;
		case 1:
			maybeTrack = cleanseTrack(maybeTrack);
			break;
	}
	if ((before == maybeTrack) && (hardness < 3))
	{
		maybeTrack = cleanseTrackHarder(maybeTrack, hardness + 1);
	}
	return maybeTrack;
}

Connector.getPageContents = function() {
	var $containers = $('#eow-description, .comment-text-content');
	var i = 0;
	var pagePlaylists = [];
	while($containers.get(i)) {
		var $container = $($containers.get(i));
		var potentialTracks = $container.html().split(/\r\n|\r|\n|<br>/g);
		potentialTracks = potentialTracks.filter(function(track) {
			track = track.trim();
			return (track.length > 0);
		});
		pagePlaylists.push(potentialTracks);
		i++;
	}
	if (pagePlaylists.length === 0) {
		return null;
	}
	return pagePlaylists;
};

Connector.findTimestamp = function (str) {
	if (typeof str === 'undefined' || str === null || str.length === 0) {
		return null;
	}

	var seconds = 0;
	var timestampStrs = str.match(timestampRegex);

	if (timestampStrs !== null && timestampStrs.length) {
		seconds = Connector.stringToSeconds(timestampStrs[0]);
	} else {
		return null;
	}
	return seconds;
};

Connector.stripTimestamps = function (str) {
	if (typeof str === 'undefined' | str === null) {
		return null;
	}
	str = str.replace(timestampRegex,'__TIMESTAMP__');
	str = str.replace(/[\[\(\{\–\-]*\s*[0-9]{1,2}\.[0-9]{2}\s*[\]\)\}\–\-:]/gi,''); // Chop out bullshit other misformatted timestamps (e.g. https://www.youtube.com/watch?v=9-NFosnfd2c)
	str = str.replace(/(\s*[\[\(\{\–\-\|:]*\s*__TIMESTAMP__)+\s*[\]\)\}\–\-:\|]*\s*/i,''); // [00:00] (e.g. https://www.youtube.com/watch?v=YKkOxFoE5yo / https://www.youtube.com/watch?v=thUQr7Q1vCY)
	str = str.replace('__TIMESTAMP__','');
	str = str.replace(/^\s*[-:=]\s*/i,''); // HH:MM - Track

	return str;
};

// numbering  1.  1 -  (1) etc. (e.g. https://www.youtube.com/watch?v=Y7QQS5V3cnI) and "track 1." (e.g. https://www.youtube.com/watch?v=FijBkSvN6N8)
var trackNubmerRegex = /^\s*(track|number|no|no\.|song)?\s*[\[\(\{\-\✘\|\*]*\s*([0-9]{1,2})(?![0-9])[\.\-\:\=\)\}\|\✘\]\*\s]+/gi;

Connector.stripTrackNumber = function (str) {
	if (typeof str === 'undefined' | str === null) {
		return null;
	}
	return str.replace(trackNubmerRegex ,'');
};

Connector.findTrackNumber = function (str) {
	if (typeof str === 'undefined' | str === null) {
		return null;
	}
	var match = trackNubmerRegex.exec(str);
	if (match === null) {
		return null;
	}
	if (typeof match[2] === 'undefined') {
		return null;
	}
	return parseInt(match[2], 10);
};

Connector.fillArtist = function (playlist) {
	/**
	 * A playlist will be:
	 * - EITHER entirely `artistTrack` (1. artistName - trackName)
	 * - OR entirely `track` (1. trackName )
	 * So make corrections for occassional false-positive `artistTrack` recognitions.
	 * e.g. 5. Undone - The Sweater Song (by Weezer) in https://www.youtube.com/watch?v=VFOF47nalCY
	*/
	var trackOnly = 0;
	var artistTrack = 0;
	playlist.forEach(function(track) {
		if (track.artist === null) {
			trackOnly++;
		} else if (track.track !== null) {
			artistTrack++;
		}
	});
	if ((artistTrack > 0) && (trackOnly > 0)) {
		console.info('Fixing mashup of artistTrack('+artistTrack+') and track('+trackOnly+')');
		if (trackOnly > artistTrack) {
			// This is probably an album, so reassemble the track title
			playlist.forEach(function(track, index, array) {
				if (track.artist !== null) {
					var forceTrackOnly = true;
					// This leaves out numbers and time, which are stripped from track.text
					// It needs reparsing because of the spaces in 'Undone - the sweater song' and in 'Jack-Ass'
					var reparsed = Connector.parseTrack(track.text, forceTrackOnly);
					if (reparsed !== null) {
						track.track = reparsed.track;
						track.artist = null;
						array[index] = track;
					} else {
						console.info('Failed to reparse a track - skipping it. This is a bug.', track);
					}
				}
			});
		}
	}
	var albumArtist = Connector.getArtistTrack().artist;
	playlist.forEach(function(track, index, array) {
		if (track.artist === null) {
			track.artist = albumArtist;
		}
		array[index] = track;
	});
	return playlist;
};

Connector.fixMultilineTracks = function (playlist, pagePlaylists) {
	// If the playlist has both numbers and time, then
	//  the track may be split with number on the first line and
	//  time on the second.
	// (This does not apply to the first track)
	if (playlist === null){
		return null;
	}
	var lines = pagePlaylists[playlist[0].pagePlaylistIndex];
	playlist.forEach(function(current, index, array) {
		if (!current.lineNumber) { return; }
		var missing = Connector.parseTrack(lines[current.lineNumber - 1]);
		if ((missing !== null) && (missing.number !== null) && (missing.startTime === null)) {
			if ((current.number === null) && (current.startTime !== null)) {
				missing.startTime = current.startTime;
				array[index] = missing;
				console.log('Replaced the multiline track "' + current.text + '" with "' + missing.text + '".');
			}
		}
	});
	return playlist;
};

Connector.fixShoddyNaming = function (playlist) {
	// Remove the artist name from tracks if they all start with it
	// https://www.youtube.com/watch?v=mhlTbu4FDeo
	if (playlist === 0) {
		return null;
	}
	var artist = Connector.getArtistTrack().artist;
	if ((artist === null) || (artist.length === 0)) {
		return playlist;
	}
	// regex escape function from StackOverflow
	artist = artist.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var artistRegex = new RegExp('^\\s*' + artist + '\\s+', 'i');
	if (_.every(playlist, function(track) { return track.track.match(artistRegex); })) {
		console.log('Removed the artist name from all tracks.');
		playlist.forEach(function(track, index, array) {
			array[index].track = track.track.replace(artistRegex, '');
		});
	}
	return playlist;
};

Connector.fixShoddyNumbering = function (playlist) {
	/**
	 * If most tracks have numbers at the beginning, it's probably a case of shoddy playlist numbering
	 * e.g. https://www.youtube.com/watch?v=epSWiHu7ggk
	 */
	if (playlist === null) {
		return null;
	}
	var beginningNumberRegex = new RegExp(/^\s*[0-9]{1,2}[\s\-:\/](.+)/i);
	var isNumbered = _.countBy(playlist, function (track) {
		return (track.artist || track.track).match(beginningNumberRegex) ? 'is' : 'isnt';
	});
	var numbered = isNumbered.is ? isNumbered.is : 0;
	var notNumbered = isNumbered.isnt ? isNumbered.isnt : 0;
	// factor of 2 = fix aphex twin numbers-in-front names compilations
	if (numbered > 2 * notNumbered) {
		console.info('Removing non-delimitered numbering from all track starts.',isNumbered);
		playlist.forEach(function(track, index, array) {
			if (track.artist !== null) {
				track.artist = track.artist.replace(beginningNumberRegex,'$1');
			} else {
				track.track = track.track.replace(beginningNumberRegex,'$1');
			}
			array[index] = track;
		});
	}

	// Opposite case - if most tracks don't have a number, then the track having a number means it's been chopped
	//  off from the track name. This can also break fillArtist (5-9-78) https://www.youtube.com/watch?v=HTEk7F0xroc
	var hasNumber = _.countBy(playlist, function (track) {
		return (track.number !== null) ? 'has' : 'hasnt';
	});
	numbered = hasNumber.has ? hasNumber.has : 0;
	notNumbered = hasNumber.hasnt ? hasNumber.hasnt : 0;
	if ((numbered > 0) && (notNumbered > 3 * numbered)) {
		playlist.forEach(function(track, index, array) {
			if (track.number !== null) {
				console.info('Reattaching the track number ('+ track.number +') to "'+ (track.artist || track.track) + '" in "'+ track.text +'".');
				var reparsed = Connector.parseTrack(track.text, false, true);
				if (reparsed !== null) {
					track = reparsed;
				}
			}
			array[index] = track;
		});
	}
	return playlist;
};

Connector.fixMissingFirstTrack = function (playlist, pagePlaylists) {
	var track = playlist[0];
	if (track.lineNumber) {
		var lines = pagePlaylists[track.pagePlaylistIndex];
		var leadingTrack = Connector.parseTrack(lines[track.lineNumber - 1]);
		if (leadingTrack === null) {
			return playlist;
		}
		if ((leadingTrack.number !== null) && (leadingTrack.number + 1 == track.number) && (track.startTime !== 0)) {
			// Fixes https://www.youtube.com/watch?v=otvGoSmEDIQ without having to reparse DOM
			if (leadingTrack.startTime === null) {
				leadingTrack.startTime = 0;
				playlist.unshift(leadingTrack);
				console.log('Found the first track which missed the 00:00 timestamp.');
			}
		}
	}
	return playlist;
};

Connector.parseTrack = function (html, forceTrackOnly, forceNoNumber) {
	var trackOnly = forceTrackOnly ? true : false;
	var noNumber = forceNoNumber ? true : false;
	var text = $('<div/>').html(html).text();
	var data = {
		startTime: Connector.findTimestamp(text),
		number: null,
		text: text,
		artist: null,
		track: null,
		lineNumber: 0, // those will be filled in extractPlaylists
		pagePlaylistIndex: 0
	};
	text = Connector.stripTimestamps(text);
	if (!noNumber) {
		data.number = Connector.findTrackNumber(text);
		text = Connector.stripTrackNumber(text);
	}
	text = cleansePlaylistLine(text); // TODO: check what this is doing exactly
	var separator = Connector.findSeparator(text);
	var artist = null;
	var track = null;
	if ((separator !== null) && !trackOnly) {
		artist = cleanseArtist(text.substr(0, separator.index));
		if (artist.length === 0) {
			artist = null;
		}
		track = text.substr(separator.index + separator.length);
	} else {
		track = text;
	}

	// Artist shouldn't be a single or double digit. I learned this the hard way :)
	if ((artist !== null) && (artist.length < 3)) {
		if (isInteger(artist)) {
			console.info('Artist name ('+artist+') should not be a short number, using "'+text+'" as track title instead.');
			track = text;
			artist = null;
		}
	}
	function isInteger(str) {
		if (str.length === 0) {
			return false;
		}
		var result = true;
		for(var i = 0; i < str.length; i++) {
			if(isNaN(parseInt(str[i], 10))) {
				result = false;
			}
		}
		return result;
	}

	// Don't discard the track if it doesn't have neither number nor time,
	// because it might be used to fix the missing timestamp:
	// TrackOne
	// TrackTwo 02:32 ...
	if ((track !== null) && (track.length > 0)) {
		track = cleanseTrack(track);
		// Check that it's not just a random sentence.
		// e.g. "Comment which is your favourite 19:13..." @ https://www.youtube.com/watch?v=_8pyf6ZW4Dk
		if (track.length > 70) {
			return null;
		}
		data.artist = artist;
		data.track = track;
		return data;
	}
	return null;
};

// Converts bare html playlists to parsed playlists
Connector.extractPlaylists = function (pagePlaylists) {
	var rawPlaylists = [];
	pagePlaylists.forEach(function(pagePlaylist, playlistIndex) {
		var tracks = [];
		pagePlaylist.forEach(function(html, index) {
			var track = Connector.parseTrack(html);
			if (track !== null) {
				track.pagePlaylistIndex = playlistIndex;
				track.lineNumber = index;
				tracks.push(track);
			}
		});
		if (tracks.length !== 0) {
			rawPlaylists.push(tracks);
		}
	});
	if (rawPlaylists.length > 0) {
		return rawPlaylists;
	}
	return null;
};

Connector.deleteTotalTimeRecord = function (playlist) {
	if (playlist === null) {
		return null;
	}
	// Eliminate 'total time:' etc. which is usually the biggest
	var longest = _.max(playlist, function (track) { return track.startTime; });
	var reparsed = Connector.parseTrack(longest.text, true);
	var invalid = true;
	var line = '';
	if (reparsed !== null) {
		invalid = false;
		line = reparsed.track;
	}
	var first = playlist[0];
	if (invalid || line.match(/total|time|duration|length/i)) {
		// it should be much longer
		if (longest.startTime / Connector.getDuration() > 0.8) {
			// it shouldn't have a track number if others have it
			if (!first.number || (!longest.number && first.number)) {
				console.log('Deleted a total time record from the playlist: "' + longest.text + '"');
				playlist = _.filter(playlist, function(track) { return (track !== longest); });
			}
		}
	}
	return playlist;
};

// Make sure the total time record is removed before using this fixer
// It is too dumb to judge on its own :)
Connector.fixDurationInsteadOfTime = function (playlist) {
	if (playlist === null) {
		return null;
	}
	if (playlist.length < 3) {
		return playlist;
	}
	var last = _.max(playlist, function (track) { return track.startTime; });
	var estimatedLastTime = Connector.getDuration() * (1 - 1 / playlist.length);
	if (last.startTime < (0.3 * estimatedLastTime)) {
		playlist.forEach(function(track, index, array) {
			array[index].duration = track.startTime;
		});
		console.info('Fixing track durations instead of timestamps in the playlist.');
		var result = Connector.fillTimestamps(playlist);
		if (result === null) {
			console.info('Fixing track durations failed with an error, defaulting to the original playlist');
			return playlist;
		} else {
			return result;
		}
	}
	return playlist;
};

Connector.buildPlaylists = function () {
	var pagePlaylists = Connector.getPageContents();
	if (pagePlaylists === null) {
		return null;
	}
	var rawPlaylists = Connector.extractPlaylists(pagePlaylists);
	if (rawPlaylists === null) {
		return null;
	}

	// TODO: this might break
	// Warning: tracks are shared between numbered and timed playlists, so
	//  it's better to avoid track modification. Also this should be fixed by
	//  selecting the best playlist in this function rather than later.
	var numberedPlaylists = [];
	var timedPlaylists = [];
	rawPlaylists.forEach(function(playlist) {
		// Find the longest uninterrupted numbered track sequence
		var numberedTracks = [];
		playlist.reduce(function(previousNumber, maybeTrack) {
			if (maybeTrack.number === null) {
				// This line does not contain numbers.
				return previousNumber;
			}
			// Starting to collect a new playlist or expanding an existing one
			if ((previousNumber === null) || (previousNumber == maybeTrack.number - 1)) {
				numberedTracks.push(maybeTrack);
				return maybeTrack.number;
			} else {
				// Improper ordering; start again but preserve the found playlist
				if (numberedTracks.length > 0) {
					numberedPlaylists.push(numberedTracks);
					numberedTracks = [];
				}
				return null;
			}
		}, null);
		// Save the last playlist which was missed by reduce
		if (numberedTracks.length > 0) {
			numberedPlaylists.push(numberedTracks);
		}

		// Collect all lines which have a timestamp
		var timedTracks = [];
		playlist.forEach(function (maybeTrack) {
			if (maybeTrack.startTime !== null) {
				timedTracks.push(maybeTrack);
			}
		});
		if (timedTracks.length > 0) {
			timedPlaylists.push(timedTracks);
		}
	});

	// There's no point in having a numbered playlist if all tracks have timestamps
	numberedPlaylists = numberedPlaylists.filter(function(playlist) {
		var allHaveTime = playlist.every(function(track) {
			return (track.startTime !== null);
		});
		return !allHaveTime;
	});

	// Array[1] coerces to the element(?) for some reason, hence double length check
	timedPlaylists = timedPlaylists.filter(function(playlist) {
		if(typeof playlist === 'undefined' || playlist === null || !playlist.length || playlist.length < 3) {
			return false;
		}
		return true;
	});

	// Operations in the following loop are sensitive to the original track order and the operation order as well.
	// Basically, this is kind of prone to breaking if anything changes in these methods.
	// Don't touch these if you don't plan to test *extensively*
	timedPlaylists.forEach(function(playlist, index, array) {
		// Fix this https://www.youtube.com/watch?v=I__o6BmwtDA (but we can't do much with the Album-Artist order)
		playlist = Connector.deleteTotalTimeRecord(playlist);
		playlist = Connector.fixDurationInsteadOfTime(playlist);
		playlist = Connector.fixMissingFirstTrack(playlist, pagePlaylists);
		playlist = Connector.fixMultilineTracks(playlist, pagePlaylists);
		// Do NOT rely on playlist numbering! e.g. https://www.youtube.com/watch?v=AIQKIcNGfZ8
		array[index] = _.sortBy(playlist, function(track) { return track.startTime; });
	});

	timedPlaylists = timedPlaylists.filter(function(playlist) {
		/**
		 * If the last timestamp starts after the video ends... well, it's probably a broken playlist
		 * E.g. https://www.youtube.com/watch?v=EfcY9oFo1YQ
		*/
		var lastTrack = playlist[playlist.length-1];
		if(Connector.getDuration() && (lastTrack.startTime > Connector.getDuration())) {
			console.info('Invalid playlist found - timestamps greater than clip duration');
			return false;
		}
		return true;
	});

	// These methods might seem like they are order-agnostic, but they aren't.
	// Add fixes preferably to the bottom of this loop.
	timedPlaylists.forEach(function(playlist, index, array) {
		playlist = Connector.fixShoddyNumbering(playlist);
		playlist = Connector.fillArtist(playlist);
		playlist = Connector.fixShoddyNaming(playlist);
		//playlist = Connector.fillAlbum(playlist);
		array[index] = playlist;
	});

	numberedPlaylists = numberedPlaylists.filter(function(playlist) {
		if(typeof playlist === 'undefined' || playlist === null || !playlist.length || playlist.length < 3) {
			return false;
		}
		return true;
	});

	numberedPlaylists.forEach(function(playlist, index, array) {
		playlist = Connector.fixMissingFirstTrack(playlist, pagePlaylists);
		playlist = Connector.fixShoddyNumbering(playlist);
		playlist = Connector.fillArtist(playlist);
		playlist = Connector.fixShoddyNaming(playlist);
		array[index] = playlist;
	});

	var result = {
		numbered : numberedPlaylists.length ? numberedPlaylists : null,
		timed: timedPlaylists.length ? timedPlaylists : null
	};
	if (result.numbered || result.timed) {
		return result;
	}
	return null;
};

Connector.getPlaylist = function () {
	if (Connector.playlist !== null) {
		console.log('Using a cached playlist');
		return Connector.playlist;
	}

	var aac = Connector.asyncAlbumCache;
	if (!aac.expired() && (aac.processed === true)) {
		console.log('Using a cached fixed album');
		return Connector.asyncAlbumCache.playlist;
	}

	var apc = Connector.asyncPlaylistCache;
	if (!apc.expired() && (apc.processed === true)) {
		console.log('Using a cached fixed playlist');
		return Connector.asyncPlaylistCache.playlist;
	}

	console.info('No (valid) playlists found; this is a single-track media.');
	return null;
};

function cleansePlaylistLine(text) {
	// TODO: do something maybe
	return text;
}

function cleanseArtist(artist) {
	if(typeof artist === 'undefined' | artist === null) {
		return null;
	}

	artist = artist.replace(/^\s+|\s+$/g, '');
	artist = artist.replace(/\s+/g, ' ');

	return artist;
}

function cleanseTrack(track) {
	if(typeof track === 'undefined' | track === null) {
		return null;
	}

	track = track.replace(/^\s+|\s+$/g, '');
	track = track.replace(/\s+/g, ' ');

	// Strip crap
	track = track.replace(/http(s)?:\/\/\S*/i,''); // any links
	track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
	track = track.replace(/\s*\[(?!untitled)[^\]]+\]$/, ''); // [whatever] but not [untitled]
	track = track.replace(/(\([\w\s]{12,}\)\s*){2,}$/i, ''); // (duplicate mix) (duplicate mix)
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
	track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
	track = track.replace(/\s*(LYRIC VIDEO\s*)?(lyric video\s*)/i, ''); // (LYRIC VIDEO)
	track = track.replace(/\s*(Official Track Stream*)/i, ''); // (Official Track Stream)
	track = track.replace(/\s*(of+icial\s*)?(music\s*)?video(?![\w])/i, ''); // (official)? (music)? video
	track = track.replace(/\s*(of+icial\s*)?(music\s*)?audio(?![\w])/i, ''); // (official)? (music)? audio
	track = track.replace(/\s*(ALBUM TRACK\s*)?(album track\s*)/i, ''); // (ALBUM TRACK)
	track = track.replace(/\s*(FULL ALBUM\s*)?(full album\s*)/i, ''); // (FULL ALBUM)
	track = track.replace(/\s*(COVER ART\s*)?(Cover Art\s*)/i, ''); // (Cover Art)
	track = track.replace(/$\s*(REMASTERED\s*)?(remastered\s*)/i, ''); // (REMASTERED)
	track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
	track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
	track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
	track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
	track = track.replace(/\s*video\s*clip/i, ''); // video clip
	track = track.replace(/\s+\(?live\)?$/i, ''); // live
	track = track.replace(/\(+\s*\)+/, ''); // Leftovers after e.g. (official video)
	track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
	track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
	track = track.replace(/^[\/,:;~\-\s"]+/, ''); // trim starting white chars and dash
	track = track.replace(/([\/.,:;~\-"!]*\s*)+$/, ''); // trim trailing white chars and dash
	//" and ! added because some track names end as {"Some Track" Official Music Video!} and it becomes {"Some Track"!} example: http://www.youtube.com/watch?v=xj_mHi7zeRQ

	return track;
}