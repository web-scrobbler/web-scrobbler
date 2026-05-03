export {};

const SEPARATOR = ':';

Connector.playerSelector = '#footerPlayer';

Connector.artistTrackSelector =
	'#footerPlayer .text-rotator .text-rotator__item:nth-child(2)';

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors(
		Connector.artistTrackSelector,
	);
	return Util.splitArtistTrack(artistTrack, [SEPARATOR]);
};

Connector.pauseButtonSelector =
	'#footerPlayer button.audio-btn.audio-btn--pause';
