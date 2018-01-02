'use strict';

Connector.playerSelector = '.ui.controls';

Connector.currentTimeSelector = '.item.start.time';

Connector.trackArtSelector = '.ui.item.active img';

Connector.getArtistTrack = () => {
	let text = $('.current .title').text().replace(/ \[.*/, '');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => $('.item.play.button').hasClass('active');

Connector.getUniqueID = () => {
	let videoUrl = $('#player').attr('src');
	return Util.getYoutubeVideoIdFromUrl(videoUrl);
};

Connector.filter = MetadataFilter.getYoutubeFilter();
