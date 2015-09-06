'use strict';

/* global Connector */

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
	var text = $.trim($(Connector.artistTrackSelector).text());

	var separator = Connector.findSeparator(text);

	if (separator === null || text.length === 0) {
		return {artist: null, track: null};
	}

	var artist =  text.substr(0, separator.index);
	var track = text.substr(separator.index + separator.length);

	/**
	* Clean non-informative garbage from title
	*/

	// Do some cleanup
	artist = artist.replace(/^\s+|\s+$/g,'');
	track = track.replace(/^\s+|\s+$/g,'');

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
	track = track.replace(/\s*(COVER ART\s*)?(Cover Art\s*)/i, ''); // (Cover Art)
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

	return {artist: artist, track: track};
};
