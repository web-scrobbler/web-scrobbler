Connector.playerSelector = '#areaCenter';

Connector.artistSelector = '#blockInfo > a[name|="artist"]';

Connector.trackSelector = '#blockInfo > a[name|="name"]';

Connector.albumSelector = '#blockInfo > a[name|="album"]';

Connector.isPlaying = function() {
	return $('div[name="now"]').hasClass('playing');
};
