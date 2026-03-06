export {};

Connector.playerSelector = '#bloc-player-audio-container+div';

Connector.pauseButtonSelector = `${Connector.playerSelector} button[aria-label="Click to Play"]`;

Connector.trackSelector = `${Connector.playerSelector} h2>strong`;

Connector.artistSelector = `${Connector.playerSelector} h2>a`;

const getTimes = () => {
	const PlayerTimeSelector = '[class*=_PlayerTime_]';
	return document.querySelector(PlayerTimeSelector)?.textContent.split(' / ');
};

Connector.getCurrentTime = () => {
	return Util.stringToSeconds(getTimes()?.[0]);
};

Connector.getDuration = () => {
	return Util.stringToSeconds(getTimes()?.[1]);
};

Connector.trackArtSelector = `${Connector.playerSelector} img`;

Connector.albumSelector = `${Connector.playerSelector} h3>a`;
