'use strict';

Connector.filter = new MetadataFilter({
	album: MetadataFilter.decodeHtmlEntities,
	all: MetadataFilter.trim
});

Connector.playerSelector = '#dragonflyTransport .rightSide';

Connector.getArtist = () => {
	return $('.trackInfoContainer .trackArtist a').attr('title');
};

Connector.trackSelector = '.trackInfoContainer .trackTitle';

Connector.getAlbum = () => {
	return $('tr.selectable.currentlyPlaying td.albumCell').attr('title') ||
		$('.nowPlayingDetail img.albumImage').attr('title') ||
		$('.trackSourceLink a').attr('title');
};

Connector.currentTimeSelector = '.songDuration.timeElapsed';

Connector.playButtonSelector = '.rightSide .playbackControls .playerIconPlay';

Connector.durationSelector = '#currentDuration';

Connector.trackArtSelector = '.rightSide .albumArtWrapper img';

Connector.getUniqueID = () => {
	let optionsHref = $('.buttonOption.main[title=Options]').attr('href');
	if (optionsHref) {
		return optionsHref.replace(/[\w|\W]+adriveId=/, '');
	}
	return null;
};
