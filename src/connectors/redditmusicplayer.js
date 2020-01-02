'use strict';

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtSelector = '.ui.item.active img';

Connector.getArtistTrack = () => {
	const text = $('.current .title').text().replace(/ \[.*/, '');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => $('.item.play.button').hasClass('active');

Connector.getUniqueID = () => {
	const videoUrl = $('#player').attr('src');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
