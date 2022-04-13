'use strict';

const playerBar = '#player';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .line3`;

Connector.trackSelector = `${playerBar} .line2`;

Connector.currentTimeSelector = `${playerBar} .time-left`;

Connector.durationSelector = `${playerBar} .time-right`;

Connector.trackArtSelector = `${playerBar} .cover img`;

Connector.pauseButtonSelector = `${playerBar} .stopped`;

// function removeYearFromArtist(text) {
// 	const regexp = new RegExp(/\s+\(\d{4}\)(?=[^\s+(\d{4})]*$)/gm);
// 	return text.replace(regexp, '');
// }
