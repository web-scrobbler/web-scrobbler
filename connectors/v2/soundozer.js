'use strict';

/* global Connector */

Connector.playerSelector = '.jp-audio';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.trackArtImageSelector = '.jp-poster img';

Connector.playButtonSelector = '.jp-play';

Connector.getArtist = function() {
	return getMetadataField('data-artist');
};

Connector.getTrack = function() {
	return getMetadataField('data-track');
};

Connector.getAlbum = function() {
	return getMetadataField('data-album');
};

Connector.getUniqueID = function() {
	return getMetadataField('data-id');
};

function getMetadataField(field) {
	return $('.jp-details').attr(field) || null;
}
