'use strict';

const playerBar = '.player';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .title-field`;

Connector.trackSelector = `${playerBar} .description-field`;

Connector.currentTimeSelector = `${playerBar} .start-time`;

Connector.durationSelector = `${playerBar} .end-time`;

Connector.trackArtSelector = `${playerBar} .cover img`;

Connector.pauseButtonSelector = `${playerBar} .ico-stop`;

// function removeYearFromArtist(text) {
// 	const regexp = new RegExp(/\s+\(\d{4}\)(?=[^\s+(\d{4})]*$)/gm);
// 	return text.replace(regexp, '');
// }
