'use strict';

const playerBar = '.player';
const trackInfoSelector = `${playerBar} .wn-V5h-u-OET_437EyjDf`;

Connector.playerSelector = '.player';

Connector.artistSelector = `${playerBar} ._1SfzMWS_FLqI5gTeovlVHb`;

Connector.trackSelector = `${playerBar} .LvJXZ-tmO_091qVzXsrAA`;

Connector.pauseButtonSelector = '.icon-player-pause';

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(trackInfoSelector, 'href');
	return trackUrl && trackUrl.split('/').pop();
};
