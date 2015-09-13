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

	return {
		artist: cleanseArtist(artist),
		track: cleanseTrack(track)
	};
};

var timestampPattern = '[0-9]{0,2}:*[0-9]{1,2}:[0-9]{2}';
var timestampRegex = new RegExp(timestampPattern,'gi');

// Run getPlaylist once very 3s, as it involves quite strenuous regex / jquery parsing of the DOM
// More to the point: the playlist only changes when the YT page does, so no point constantly scanning it.
Connector.setThrottleInterval(3000);

// The playlist does not change on its own, so cache it and invalidate when the video id or DOM changes
var playlistCache = {
	hash: null,
	value: null,
	getPageHash: function () {
		return Connector.getUniqueID() + $('#eow-description, .comment-text-content').length;
	},
	isValid: function () {
		return (this.hash == this.getPageHash());
	},
	setValue: function(newValue) {
		this.hash = this.getPageHash();
		this.value = newValue;
	}
};

Connector.getPlaylist = function () {
	if (playlistCache.isValid()) {
		// Cache hit
		console.info('This is a cached playlist.');
		return playlistCache.value;
	} else {
		// Invalid cache - rebuild playlist
		var playlists = [];

		var $containers = $('#eow-description, .comment-text-content');
		var i = 0;
		// Fetch up to 3 playlists on the page
		while($containers.get(i) && (playlists.length < 3)) {
			var $container = $($containers.get(i));
			var potentialPlaylist = null;

			if(timestampRegex.test($container.html())) {
				var potentialTracks = $container.html().split(/\r\n|\r|\n|<br>/g);
				potentialPlaylist = buildPlaylist(potentialTracks);
			}

			if (typeof potentialPlaylist !== 'undefined' && potentialPlaylist !== null) {
				playlists.push(potentialPlaylist);
			}
			i++;
		}

		if(playlists.length === 0) {
			console.info('No (valid) playlists found; this is a single-track media.');
			return null;
		} else {
			// Select the longest playlist
			var playlist = playlists.reduce(function(result, currentPlaylist) {
				if (currentPlaylist.length >= result.length) {
					return currentPlaylist;
				}
				return result;
			});
			console.info('This is a playlist.', playlist);
			playlistCache.setValue(playlist);

			return playlist;
		}
	}
};

function buildPlaylist(potentialTracks) {
	var stringProperty = 'track'; // Used further down to ID which property to tweak en-masse.
	var potentialPlaylist = parsePlaylist(potentialTracks);
	/**
	 * Check that this 'playlist' actually has enough....
	*/
	if(typeof potentialPlaylist === 'undefined' || potentialPlaylist === null || potentialPlaylist.length < 3) {
		return null;
	}

	// Do NOT rely on playlist numbering! e.g. https://www.youtube.com/watch?v=AIQKIcNGfZ8
	potentialPlaylist = _.sortBy(potentialPlaylist, function(track) { return track.startTime; });

	/**
	 * If the last timestamp starts after the video ends... well, it's probably a broken playlist
	 * E.g. https://www.youtube.com/watch?v=EfcY9oFo1YQ
	*/
	if(Connector.getDuration() && potentialPlaylist[potentialPlaylist.length-1].startTime > Connector.getDuration()) {
		console.info('Invalid playlist - timestamps greater than clip duration');
		return null;
	}

	/**
	 * A playlist will be:
	 * - EITHER entirely `artistTrack` (1. artistName - trackName)
	 * - OR entirely `track` (1. trackName )
	 * So make corrections for occassional false-positive `artistTrack` recognitions.
	 * e.g. 5. Undone - The Sweater Song (by Weezer) in https://www.youtube.com/watch?v=VFOF47nalCY
	*/
	var propertyCount = _.countBy(potentialPlaylist, function(track) {
		if(track.artistTrack) { return 'artistTrack'; }
		if(track.track) { return 'track'; }
		return;
	});
	// If there's a mixture of tracks and ArtistTracks, something's clearly fishy...
	if(propertyCount.track > 0 && propertyCount.artistTrack > 0) {
		console.info('Playlist parser - fixing mashup of artistTrack + track', propertyCount);
		// if there are a large number of tracks identified as NOT artistTrack
		// then put the data in .track and cleanse .artistTrack;
		if(propertyCount.track > propertyCount.artistTrack) {
			// console.info('Playlist parser - converting all to TRACK');
			_.each(potentialPlaylist, function(track) {
				track.track = track.artistTrack || track.track;
				delete track.artistTrack;
			});
			stringProperty = 'track';
		}
		// Otherwise it's likely the reverse situation,
		// so put all data in .artistTrack and cleanse .track
		else {
			// # console.info('Playlist parser - converting all to ARTIST_TRACK');
			_.each(potentialPlaylist, function(track) {
				track.artistTrack = track.track || track.artistTrack;
				delete track.track;
			});
			stringProperty = 'artistTrack';
		}
	} else if(propertyCount.artistTrack > 0) {
		stringProperty = 'artistTrack';
	}

	/**
	 * If most tracks have numbers at the beginning, it's probably a case of shoddy playlist numbering
	 * e.g. https://www.youtube.com/watch?v=epSWiHu7ggk
	*/
	var beginningNumberRegex = new RegExp(/^\s*[0-9]{1,2}[\s\-:\/](.+)/i);
	var isNumbered = _.countBy(potentialPlaylist, function(track) {
		return track[stringProperty].match(beginningNumberRegex) ? 'is' : 'isnt';
	});
	if (isNumbered.is > 2 * isNumbered.isnt) {
		console.info('Playlist parser - removing non-delimitered numbering from all track starts.',isNumbered);
		_.each(potentialPlaylist, function(track) {
			track[stringProperty] = track[stringProperty].replace(beginningNumberRegex,'$1');
		});
	}

	return potentialPlaylist;
}

function parseTrack(maybeTrack) {
	var entry = {};

	var $maybeTrack = $('<div>'+maybeTrack+'</div>');

	// YouTube automatically adds markup to timestamps...
	var $timestampEls = $maybeTrack.find('a[onclick*=\'seekTo\']');
	// ... but not when HH:MM exceeds 59:59, so also search for HH:MM
	var timestampStrs = maybeTrack.match(timestampRegex);

	// No timestamps in this line.
	if(($timestampEls === null || !$timestampEls.length) && (timestampStrs === null || !timestampStrs.length)) {
		return null;
	}

	if ($timestampEls !== null && $timestampEls.length) {
		entry.startTime = Connector.stringToSeconds($timestampEls.first().text());
	} else if (timestampStrs !== null && timestampStrs.length) {
		entry.startTime = Connector.stringToSeconds(timestampStrs[0]);
	}

	// Cleanse trackArtist data of timestamp, delimiters, etc.
	maybeTrack = cleansePlaylistLine(maybeTrack);
	maybeTrack = cleanseTrack(maybeTrack);

	// Check that it's not just a random sentence.
	// e.g. "Comment which is your favourite 19:13..." @ https://www.youtube.com/watch?v=_8pyf6ZW4Dk
	if(maybeTrack.length > 60) {
		return null;
	}

	// Are these tracks by a single artist, or artistTrack (a compilation e.g. https://www.youtube.com/watch?v=EzjX0QE_l8U)?
	var separator = Connector.findSeparator(maybeTrack);
	if (separator !== null) {
		entry.artistTrack = maybeTrack;
	} else {
		entry.track = maybeTrack;
	}
	return entry;
}

function parsePlaylist(potentialTracks) {
	var potentialPlaylist = [];
	// First track array index in potentialTracks
	var firstTrackOffset = 0;

	_.each(potentialTracks, function(maybeTrack) {
		var entry = parseTrack(maybeTrack);
		if (entry !== null)
		{
			potentialPlaylist.push(entry);
		} else {
			if (potentialPlaylist.length === 0) {
				firstTrackOffset++;
			}
		}
	});

	var getLeadingNumber = function (maybeTrack) {
		var nubmerRegex = /^\s*(track|number|no|no\.|song)?\s*[\[\(\{\-]*\s*([0-9]{1,2})\s*[\.\-:=\)\]\}]*\s*/i;
		var match = nubmerRegex.exec(maybeTrack);
		var trackNumber = 0;
		if (match !== null) {
			trackNumber = parseInt(match[2], 10);
		}
		return trackNumber;
	};

	if (potentialPlaylist.length > 0) {
		if (firstTrackOffset > 0) {
			var maybeLeadingTrack = potentialTracks[firstTrackOffset - 1];
			var leadingTrackNumber = getLeadingNumber(maybeLeadingTrack);
			var firstTrackNumber = getLeadingNumber(potentialTracks[firstTrackOffset]);
			if ((leadingTrackNumber + 1 == firstTrackNumber) && (potentialPlaylist[0].startTime !== 0)) {
				// We have found the first track which missed the 00:00 timestamp - add it.
				// Fixes https://www.youtube.com/watch?v=otvGoSmEDIQ without having to reparse DOM
				var realFirstTrack = parseTrack(maybeLeadingTrack + ' 00:00');
				if (realFirstTrack !== null) {
					potentialPlaylist.unshift(realFirstTrack);
				}
			}
		}
		return potentialPlaylist;
	}
	return null;
}

function cleansePlaylistLine(maybeTrack) {
	maybeTrack = maybeTrack.replace(timestampRegex,'__TIMESTAMP__');
	maybeTrack = maybeTrack.replace(/[\[\(\{\–\-]*\s*[0-9]{1,2}\.[0-9]{2}\s*[\]\)\}\–\-:]/gi,''); // Chop out bullshit other misformatted timestamps (e.g. https://www.youtube.com/watch?v=9-NFosnfd2c)
	maybeTrack = maybeTrack.replace(/<a.*>(__TIMESTAMP__)<\/a>/gi,'$1');
	maybeTrack = maybeTrack.replace(/\s*[\[\(\{\–\-]*\s*__TIMESTAMP__\s*[\]\)\}\–\-:]*\s*/gi,''); // [00:00] (e.g. https://www.youtube.com/watch?v=YKkOxFoE5yo / https://www.youtube.com/watch?v=thUQr7Q1vCY)
	maybeTrack = maybeTrack.replace('__TIMESTAMP__','');
	maybeTrack = maybeTrack.replace(/\s*&[a-z]+;\s*/gi,''); // remove HTML entity codes (e.g. https://www.youtube.com/watch?v=VFOF47nalCY)
	maybeTrack = maybeTrack.replace(/^\s*[-:=]\s*/gi,''); // HH:MM - Track
	maybeTrack = maybeTrack.replace(/^\s*(track|number|no|no\.|song)?\s*[\[\(\{\-]*\s*[0-9]{1,2}\s*[\.\-:=\)\]\}]{1,3}\s*/i,''); // numbering  1.  1 -  (1) etc. (e.g. https://www.youtube.com/watch?v=Y7QQS5V3cnI) and "track 1." (e.g. https://www.youtube.com/watch?v=FijBkSvN6N8)

	return maybeTrack;
}

function cleanseArtist(artist) {
	if(typeof artist === 'undefined' | artist === null) { return; }

	artist = artist.replace(/^\s+|\s+$/g, '');
	artist = artist.replace(/\s+/g, ' ');

	return artist;
}

function cleanseTrack(track) {
	if(typeof track === 'undefined' | track === null) { return; }

	track = track.replace(/^\s+|\s+$/g, '');
	track = track.replace(/\s+/g, ' ');

	// Strip crap
	track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
	track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
	track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
	track = track.replace(/\s*(LYRIC VIDEO\s*)?(lyric video\s*)/i, ''); // (LYRIC VIDEO)
	track = track.replace(/\s*(Official Track Stream*)/i, ''); // (Official Track Stream)
	track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
	track = track.replace(/\s*(of+icial\s*)?(music\s*)?audio/i, ''); // (official)? (music)? audio
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
	track = track.replace(/^[\/\s,:;~-\s"]+/, ''); // trim starting white chars and dash
	track = track.replace(/[\/\s,:;~-\s"\s!]+$/, ''); // trim trailing white chars and dash
	//" and ! added because some track names end as {"Some Track" Official Music Video!} and it becomes {"Some Track"!} example: http://www.youtube.com/watch?v=xj_mHi7zeRQ

	return track;
}
