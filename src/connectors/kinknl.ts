export {};

Connector.playerSelector = ':has(>button>svg)';

Connector.artistSelector = `${Connector.playerSelector} p:nth-child(2)`;
Connector.trackSelector = `${Connector.playerSelector} p:nth-child(3)`;

const playPauseButtonSelector = `${Connector.playerSelector}>button>svg`;

Connector.isPlaying = () => {
	const playPauseButton = document.querySelector(playPauseButtonSelector);
	if (playPauseButton?.querySelector(':scope>rect+rect')) {
		return true;
	}
	if (playPauseButton?.querySelector(':scope>polygon')) {
		return false;
	}
	return null;
};

Connector.scrobblingDisallowedReason = () =>
	Connector.getArtist()?.startsWith('KINK') ? 'FilteredTag' : null;

Connector.loveButtonSelector = `${Connector.playerSelector} div>button[class~=bg-color-1]:first-child`;
Connector.unloveButtonSelector = `${Connector.playerSelector} div>button[class~=bg-color-9]:first-child`;
