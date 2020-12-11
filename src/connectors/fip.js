'use strict';

const playerBar = '.RFplayer';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .media-informations a:first-child`;

Connector.trackSelector = `${playerBar} .media-informations a:last-child`;

Connector.currentTimeSelector = `${playerBar} .start-time`;

Connector.durationSelector = `${playerBar} .end-time`;

Connector.trackArtSelector = `${playerBar} .cover img`;

Connector.pauseButtonSelector = `${playerBar} .ico-stop`;

// function removeYearFromArtist(text) {
// 	const regexp = new RegExp(/\s+\(\d{4}\)(?=[^\s+(\d{4})]*$)/gm);
// 	return text.replace(regexp, '');
// }
