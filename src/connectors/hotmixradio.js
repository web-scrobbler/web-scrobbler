'use strict';

Connector.playerSelector = '#new_ajax-player';

Connector.getArtist = () => getScrollableText('#hotmixPlayerSongArtist');

Connector.getTrack = () => getScrollableText('#hotmixPlayerSongTitle');

Connector.trackArtSelector = '#hotmixPlayerSongCover';

Connector.isPlaying = () => $('#play-pause .fa-pause').length > 0;

function getScrollableText(selector) {
	return $(`${selector} a`).first().text() || $(selector).text();
}
