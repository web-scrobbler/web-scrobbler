export {};

// Target the fixed player at the bottom
Connector.playerSelector = 'div.audio-player-backdrop.fixed';

// Now scope everything to within that player
Connector.trackSelector =
	'div.audio-player-backdrop.fixed h3.font-semibold.text-white';

Connector.artistSelector =
	'div.audio-player-backdrop.fixed a[href^="/artist/"]';

Connector.albumSelector = 'div.audio-player-backdrop.fixed a[href^="/album/"]';

Connector.playButtonSelector =
	'div.audio-player-backdrop.fixed button[aria-label="Play"]';

Connector.durationSelector =
	'div.audio-player-backdrop.fixed div.mt-1 span:last-child';

Connector.currentTimeSelector =
	'div.audio-player-backdrop.fixed div.mt-1 span:first-child';
