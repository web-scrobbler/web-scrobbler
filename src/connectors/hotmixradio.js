'use strict';

Connector.playerSelector = '#new_ajax-player';

Connector.getArtist = () => getScrollableText('#hotmixPlayerSongArtist');

Connector.getTrack = () => getScrollableText('#hotmixPlayerSongTitle');

Connector.trackArtSelector = '#hotmixPlayerSongCover';

Connector.pauseButtonSelector = '#play-pause .fa-pause';

function getScrollableText(selector) {
	const scrollableSelector = `${selector} a`;
	return Util.getTextFromSelectors([scrollableSelector, selector]);
}
