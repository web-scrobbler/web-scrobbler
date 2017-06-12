'use strict';

/* global Connector, MetadataFilter, Util */

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtSelector = '.ui.item.active img';

Connector.getArtistTrack = function () {
	let text = $('.current .title').text().replace(/ \[.*/, '');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = function() {
	return $('.item.play.button').hasClass('active');
};

Connector.getUniqueID = function() {
	let videoUrl = $('#player').attr('src');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.filter = MetadataFilter.getYoutubeFilter();
