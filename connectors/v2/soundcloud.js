'use strict';

/* global Connector */

/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack({artist, track}) {
	/*jslint regexp: true*/
	// trim whitespace
	if (artist !== null) {
		artist = artist.replace(/^\s+|\s+$/g, '');
	}

	if (track !== null) {
		track = track.replace(/^\s+|\s+$/g, '');

		// Strip crap
		track = track.replace(/^\d+\.\s*/, ''); // 01.
		track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
		track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
		track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
		track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
		track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
		track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
		track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
		track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
		track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
		track = track.replace(/\s*video\s*clip/i, ''); // video clip
		track = track.replace(/\s+\(?live\)?$/i, ''); // live
		track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
		track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
		track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
		track = track.replace(/^[\/\s,:;~\-]+/, ''); // trim starting white chars and dash
		track = track.replace(/[\/\s,:;~\-]+$/, ''); // trim trailing white chars and dash
	}
	/*jslint regexp: false*/
	return {artist, track};
}

Connector.getArtistTrack = function () {
	const text = $('.playbackSoundBadge__title').attr('title');
	const separator = this.findSeparator(text);

	let artist = null;
	let track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return cleanArtistTrack({artist, track});
};

Connector.playerSelector = '.playControls';

const progressSelector = 'div.playbackTimeline__progressWrapper';
Connector.getCurrentTime = function () {
	return parseFloat($(progressSelector).attr('aria-valuenow')) / 1000;
};

Connector.getDuration = function () {
	return parseFloat($(progressSelector).attr('aria-valuemax')) / 1000;
};

Connector.isPlaying = function () {
	return $('.playControl').hasClass('playing');
};
