export {};

Connector.playerSelector = '#audio-player.audio-player';

Connector.pauseButtonSelector = 'i.icon-pause';

Connector.trackSelector = 'main[class^="_about_"] div.fs-16';

Connector.artistSelector = 'main[class^="_about_"] > div.fs-14.ellipsis';

Connector.albumSelector = 'main[class^="_about_"] > div[markuee]';

Connector.currentTimeSelector =
	'div[class^="_controls_"] + div > span.align-right';

Connector.remainingTimeSelector =
	'div[class^="_controls_"] + div span:last-child';

Connector.trackArtSelector = 'div[class^="_header_"] > img[class=^"_cover_"]';
