'use strict';

/* global Connector, MetadataFilter */

Connector.playerSelector = '#player';

Connector.artistSelector = '#tracka';

Connector.trackSelector = '#tracktitle';

Connector.albumSelector = '#album';

Connector.isPlaying = function() {
	var e = $('.play-pause .play');
	return (e === null || !e.is(':visible'));
};

Connector.currentTimeSelector = '.played';

Connector.getTrackArt = function() {
	return $('#imgcover').prop('src');
};

Connector.getDuration = function () {
	return Math.round($('audio')[0].duration);
};

/** Returns a unique identifier of current track.
 *  @returns {String|null} */
Connector.getUniqueID = function () {
	var match = /&id=(\d+)&/.exec($('audio').first().attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.removeZeroWidth, MetadataFilter.trim]
});
