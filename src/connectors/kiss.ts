export {};

Connector.playerSelector = ['.current', '.player-wrapper'];

Connector.artistSelector = '.artist';

Connector.trackSelector = '.song';

Connector.playButtonSelector = '#play:not(.hidden)';

Connector.pauseButtonSelector = '#stop:not(.hidden)';

Connector.scrobbleInfoLocationSelector = '.current';

Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	color: '#fff',
	marginTop: '5px',
	textShadow: '1px 1px 1px rgba(0,0,0,.5)',
};

Connector.scrobblingDisallowedReason = () => {
	if (Util.getTextFromSelectors(Connector.artistSelector) === 'KISS') {
		return 'FilteredTag';
	}
	return null;
};
