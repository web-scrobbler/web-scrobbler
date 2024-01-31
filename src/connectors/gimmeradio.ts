export {};

Connector.playerSelector = '#foobar';

Connector.artistSelector = '.fRAiDH';

Connector.trackSelector = '.fZIbtd';

Connector.onReady = Connector.onStateChanged;

Connector.scrobblingDisallowedReason = () => {
	return Connector.getArtist()?.includes('Gimme Country') ||
		Connector.getArtist()?.includes('Gimme Radio') ||
		Connector.getArtist()?.includes('Gimme Metal')
		? 'FilteredTag'
		: null;
};
