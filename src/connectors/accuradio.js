'use strict';

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist div:first-child, #songartist';

Connector.getArtist = () => getScrollableText('#songartist');

Connector.getTrack = () => getScrollableText('#songtitle');

Connector.getAlbum = () => getScrollableText('#songalbum');

Connector.trackArtSelector = '#albumArtImg';

Connector.pauseButtonSelector = '#playerPauseButton';

function getScrollableText(selector) {
	const scrollableSelector = `${selector} div`;
	return Util.getTextFromSelectors([scrollableSelector, selector]);
}
