'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.trackArtImageSelector = '#player .imgWrapper .img';

Connector.artistSelector = '#player .secondaryMetadata a:first';

Connector.trackSelector = '#player .primaryMetadata a:first';

Connector.getAlbum = function() {
	var album = $('#player .imgWrapper .img').attr('alt');
	album = album.substr(album.indexOf('-')+1);
	return album || null;
};

Connector.currentTimeSelector = '.playerDurationText .playerDurationTextOnGoing';

Connector.playButtonSelector = '#player button.iconPlayerPlay';
