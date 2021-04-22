'use strict';

const currentTimeSelector = '.dBVUFV > .jVXvOE > .eDQGaR > .cwMKJQ';
const durationSelector = '.dBVUFV > .jVXvOE > .eDQGaR > .eguLQa';

Connector.playerSelector = '.MiniSessionPlayer__PlayerBar-du0okt-4';
Connector.artistSelector = '.MiniSessionPlayer__Subtitle-du0okt-11';
Connector.trackSelector = '.MiniSessionPlayer__Title-du0okt-10';
Connector.trackArtSelector = '.MiniSessionPlayer__IconImage-du0okt-9';

Connector.getCurrentTime = () => getSeconds(currentTimeSelector);
Connector.getDuration = () => getSeconds(durationSelector);

function getSeconds(selector) {
	const timeStr = Util.getTextFromSelectors(selector);
	return Util.stringToSeconds(timeStr);
}
