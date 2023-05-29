export {};

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist div:first-child, #songartist';

Connector.getArtist = () => getScrollableText('#songartist');

Connector.getTrack = () => getScrollableText('#songtitle');

Connector.getAlbum = () => getScrollableText('#songalbum');

Connector.trackArtSelector = '#albumArtImg';

Connector.pauseButtonSelector = '#playerPauseButton';

function getScrollableText(selector: string) {
	return (
		Util.getTextFromSelectors(`${selector} div`) ||
		Util.getTextFromSelectors(selector)
	);
}

function getDuration() {
	const text = Util.getTextFromSelectors('#progressWrapper');
	if (text === null) {
		return null;
	}

	return text.split('/');
}

Connector.getCurrentTime = () => {
	const duration = getDuration();
	if (duration === null) {
		return null;
	}

	return Util.stringToSeconds(duration[0].trim());
};

Connector.getDuration = () => {
	const duration = getDuration();
	if (duration === null) {
		return null;
	}

	return Util.stringToSeconds(duration[1].trim());
};
