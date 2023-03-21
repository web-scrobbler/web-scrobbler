export {};

Connector.playerSelector = '#new_ajax-player';

Connector.getArtist = () => getScrollableText('#hotmixPlayerSongArtist');

Connector.getTrack = () => getScrollableText('#hotmixPlayerSongTitle');

Connector.trackArtSelector = '#hotmixPlayerSongCover';

Connector.pauseButtonSelector = '#play-pause .fa-pause';

function getScrollableText(selector: string) {
	return (
		Util.getTextFromSelectors(`${selector} a`) ||
		Util.getTextFromSelectors(selector)
	);
}
