export {};

Connector.playerSelector = '[class^=PopupPlayer_popupPlayer__player__]';

Connector.artistTrackSelector = '[class^=PlayerTriton_playerTriton__title__]';

Connector.isPlaying = () => {
	return (
		!Util.isElementVisible(
			'[class*=PlayerTriton_playerTriton--loading__]'
		) &&
		Util.getAttrFromSelectors(
			'[class^=PlayerTriton_playerTriton__left__] svg path',
			'd'
		) === 'M.08.192h28v28h-28z'
	);
};

Connector.isScrobblingAllowed = () =>
	!Connector.getArtistTrack()?.artist?.startsWith('KINK');
