'use strict';

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist div:first-child, #songartist';

Connector.getArtist = () => getScrollableText('#songartist');

Connector.getTrack = () => getScrollableText('#songtitle');

Connector.getAlbum = () => getScrollableText('#songalbum');

Connector.getTrackArt = () => {
	let trackArtUrl = $('#albumArtImg').attr('src');
	return trackArtUrl !== null ? `http:${trackArtUrl}` : null;
};

Connector.isPlaying = () => $('#playerPauseButton').length > 0;

function getScrollableText(selector) {
	return $(`${selector} div`).first().text() || $(selector).text();
}
