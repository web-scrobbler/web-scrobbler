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

Connector.playerSelector = '#page';

Connector.artistTrackSelector = '#eow-title';

Connector.currentTimeSelector = '#player-api .ytp-time-current';

Connector.durationSelector = '#player-api .ytp-time-duration';

Connector.getUniqueID = function() {
	var url = window.location.href;
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[7].length==11){
		return match[7];
	}
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

// Run getPlaylist once very 5s, as it involves quite strenuous regex / jquery parsing of the DOM
// More to the point: the playlist only changes when the YT page does, so no point constantly scanning it.
Connector.getPlaylist = _.throttle(getPlaylist, 5000);

function getPlaylist() {
	var playlist = [];

	var $containers = $('#eow-description, .comment-text-content');
	var i = 0;
	var found = false;

	while($containers.get(i) && !found) {
		var $container = $($containers.get(i));
		var potentialPlaylist = [];

		if(timestampRegex.test($container.html())) {
			var potentialTracks = $container.html().split(/\r\n|\r|\n|<br>/g);
			potentialPlaylist = parsePlaylist(potentialTracks);
		}

		if (potentialPlaylist.length > 1) {
			playlist = potentialPlaylist;
			found = true;
		} else {
			i++;
		}
	}

	if(playlist.length === 0) {
		console.info('No playlists found; this is a single-track video.');
		return null;
	}
	// It's probably not a playlist if it's just a few timestamps...
	// E.g. "Omg lol at 01:05 and 02:45!11!1"
	if(playlist.length < 3) {
		console.info('Invalid playlist - too few timestamps; probably a false-positive');
		return null;
	}

	playlist = _.sortBy(playlist, function(track) { return track.startTime; });

	// If the last timestamp starts after the video ends... well, it's probably a broken playlist
	// E.g. https://www.youtube.com/watch?v=EfcY9oFo1YQ
	if(Connector.getDuration() && playlist[playlist.length-1].startTime > Connector.getDuration()) {
		console.info('Invalid playlist - timestamps greater than clip duration');
		return null;
	}

	console.info('This is a playlist.', playlist);

	return playlist;
}

function parsePlaylist(potentialTracks) {
	// console.log(potentialTracks);
	var potentialPlaylist = [];

	_.each(potentialTracks, function(maybeTrack) {
		var entry = {};
		var $maybeTrack = $('<div>'+maybeTrack+'</div>');

		// YouTube automatically adds markup to timestamps...
		var $timestampEls = $maybeTrack.find('a[onclick*=\'seekTo\']');

		// ... but not when HH:MM exceeds 59:59, so also search for HH:MM
		var timestampStrs = maybeTrack.match(timestampRegex);

		if(($timestampEls !== null && $timestampEls.length) || (timestampStrs !== null && timestampStrs.length)) {
			if ($timestampEls !== null && $timestampEls.length) {
				entry.startTime = Connector.stringToSeconds($timestampEls.first().text());
			} else if (timestampStrs !== null && timestampStrs.length) {
				entry.startTime = Connector.stringToSeconds(timestampStrs[0]);
			}

			// Cleanse trackArtist data of timestamp, delimiters, etc.
			maybeTrack = cleansePlaylistLine(maybeTrack);
			maybeTrack = cleanseTrack(maybeTrack);

			// Are these tracks by a single artist, or artistTrack (a compilation e.g. https://www.youtube.com/watch?v=EzjX0QE_l8U)?
			var separator = Connector.findSeparator(maybeTrack);
			if (separator !== null) {
				entry.artistTrack = maybeTrack;
			} else {
				entry.track = maybeTrack;
			}

			potentialPlaylist.push(entry);
		}
	});

	// A playlist will be:
	// - EITHER entirely `artistTrack` (1. artistName - trackName)
	// - OR entirely `track` (1. trackName )
	// So make corrections for occassional false-positive `artistTrack` recognitions.
	// e.g. 5. Undone - The Sweater Song (by Weezer) in https://www.youtube.com/watch?v=VFOF47nalCY
	var propertyCount = _.countBy(potentialPlaylist, function(track) {
        if(track.artistTrack) { return "artistTrack"; }
        if(track.track) { return "track"; }
		return;
	});

	// If there's a mixture of tracks and ArtistTracks, something's clearly fishy...
	if(propertyCount.track > 0 && propertyCount.artistTrack > 0) {
		console.info("Playlist parser - fixing mashup of artistTrack + track", propertyCount)
		// if there are a large number of tracks identified as NOT artistTrack
		// then put the data in .track and cleanse .artistTrack;
		if(propertyCount.track > propertyCount.artistTrack) {
			console.info("Playlist parser - converting all to TRACK");
			_.each(potentialPlaylist, function(track) {
		        track.track = track.artistTrack || track.track;
				delete track.artistTrack;
		    });
		}
		// Otherwise it's likely the reverse situation,
		// so put all data in .artistTrack and cleanse .track
		else {
			console.info("Playlist parser - converting all to ARTIST_TRACK");
			_.each(potentialPlaylist, function(track) {
		        track.artistTrack = track.track || track.artistTrack;
				delete track.track;
		    });
		}
	}

	return potentialPlaylist;
}

function cleansePlaylistLine(maybeTrack) {
	maybeTrack = maybeTrack.replace(timestampRegex,'__TIMESTAMP__');
	maybeTrack = maybeTrack.replace(/<a.*>(__TIMESTAMP__)<\/a>/gi,'$1');
	maybeTrack = maybeTrack.replace(/\s*[\[\(\{]__TIMESTAMP__[\]\)\}]/gi,''); // [00:00] (e.g. https://www.youtube.com/watch?v=YKkOxFoE5yo)
	maybeTrack = maybeTrack.replace('__TIMESTAMP__','');
	maybeTrack = maybeTrack.replace(/\s*&[a-z]+;\s*/gi,''); // remove HTML entity codes (e.g. https://www.youtube.com/watch?v=VFOF47nalCY)
	maybeTrack = maybeTrack.replace(/\s*[\[\(]*[0-9]+[\.:\-\]\)]+\s*/i,''); // numbering in middle of str [1] 1) (e.g. https://www.youtube.com/watch?v=RW3li2XWgoM)
	maybeTrack = maybeTrack.replace(/^\s*[-:=]\s*/gi,''); // HH:MM - Track

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
