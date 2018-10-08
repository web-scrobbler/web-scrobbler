'use strict';

Connector.playerSelector = '.playerMusic';

Connector.artistSelector = '.albutTit span span a';

Connector.trackSelector = '.albumTit h2 span a';

Connector.currentTimeSelector = '.timeStart';

Connector.durationSelector = '.timeEnd';

Connector.isPlaying = () => {
	return $('.btnPlayArea pause').length !== 0;
};