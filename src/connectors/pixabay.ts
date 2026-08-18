export {};

// playerbar is only added when audio is played, but (hopefully?) never removed
Connector.playerSelector = '[class*=playbar--]';

Connector.trackSelector = '[class*=trackDetails--] [class*=title--]';
Connector.artistSelector = '[class*=trackDetails--] [class*=artist--]';

// progressBar-- or progressWaveform--
Connector.currentTimeSelector =
	'[class*=progress] [class*=timing--]:first-child';
Connector.pauseButtonSelector = '[class*=progress][class*=active--]';
Connector.durationSelector = '[class*=progress] [class*=timing--]:last-child';
Connector.trackArtSelector = '[class*=playbar--] [class*=thumbnail--] img';
Connector.unloveButtonSelector =
	'[class*=playbar--] button [aria-label="HeartFilled"]';
