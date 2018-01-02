'use strict';

Connector.playerSelector = '#areaCenter';

Connector.artistSelector = '#blockInfo > a[name|="artist"]';

Connector.trackSelector = '#blockInfo > a[name|="name"]';

Connector.albumSelector = '#blockInfo > a[name|="album"]';

Connector.trackArtSelector = '[name="cover"]';

Connector.isPlaying = () => {
	let audio = $('body > audio').get(0);
	return audio && !audio.paused;
};
