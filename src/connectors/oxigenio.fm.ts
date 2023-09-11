export {};

Connector.playerSelector = '.wp-lunaradio.lunaaudioplayer';

Connector.artistTrackSelector =
	'div[id^="wp"][id$="texttitle"] span:nth-child(1)';

Connector.playButtonSelector = 'div[id^="wp"][id$="buttonplay"]';

Connector.isStateChangeAllowed = () => {
	const artistTrack = Util.getTextFromSelectors(
		Connector.artistTrackSelector,
	);
	return artistTrack?.includes('-') && !artistTrack?.match(/^\s*OXIGENIO - /);
};
