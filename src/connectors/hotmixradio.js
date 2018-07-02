'use strict';

Connector.playerSelector = '#new_ajax-player';

Connector.artistSelector = '#hotmixPlayerSongArtist .ajax';

Connector.getArtist = () => getScrollableText('#hotmixPlayerSongArtist');

Connector.getTrack = () => getScrollableText('#hotmixPlayerSongTitle');

Connector.getTrackArt = () => {
	let trackArtUrl = $('#hotmixPlayerSongCover').attr('src');
	return trackArtUrl !== null ? `${trackArtUrl}` : null;
};

Connector.isPlaying = () => $('#play-pause .fa-pause').length > 0;

function getScrollableText(selector) {
	return $(`${selector} a`).first().text() || $(selector).text();
}
