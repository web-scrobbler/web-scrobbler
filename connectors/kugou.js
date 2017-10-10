'use strict';

Connector.playerSelector = '.player-module';

Connector.trackSelector = '#songName';

Connector.artistSelector = '.singerName.fl>a';

Connector.albumSelector = '.albumName>a';

Connector.trackArtSelector = '.albumImg img';

Connector.playButtonSelector = '.icon-playbar-play';

Connector.currentTimeSelector = '.change-time';

Connector.durationSelector = '.all-time';

Connector.getUniqueID = () => {
	let text = document.location.hash.substr(1);
	return text.split('&').shift().split('=').pop();
};
