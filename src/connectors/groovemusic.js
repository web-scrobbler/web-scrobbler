'use strict';

Connector.playerSelector = '#player';

Connector.trackArtSelector = '#player .imgWrapper .img';

Connector.artistSelector = '#player .secondaryMetadata a:first';

Connector.trackSelector = '#player .primaryMetadata a:first';

Connector.getAlbum = () => {
	let album = $('#player .imgWrapper .img').attr('alt');
	return album.substr(album.indexOf('-') + 1);
};

Connector.currentTimeSelector = '.playerDurationText .playerDurationTextOnGoing';

Connector.playButtonSelector = '#player button.iconPlayerPlay';
