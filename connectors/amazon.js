'use strict';

/* global Connector, MetadataFilter, Util */

Connector.filter = new MetadataFilter({
	album: MetadataFilter.decodeHtmlEntities,
	all: MetadataFilter.trim
});

Connector.playerSelector = '#dragonflyTransport .rightSide';

Connector.getArtist = function() {
	return $('.trackInfoContainer .trackArtist a').attr('title');
};

Connector.trackSelector = '.trackInfoContainer .trackTitle';


Connector.getAlbum = function() {
	return $('tr.selectable.currentlyPlaying td.albumCell').attr('title') ||
		$('.nowPlayingDetail img.albumImage').attr('title') ||
		$('.trackSourceLink a').attr('title');
};

Connector.currentTimeSelector = '.songDuration.timeElapsed';

Connector.playButtonSelector = '.rightSide .playbackControls .playerIconPlay';

Connector.getDuration = function() {
	return Util.stringToSeconds($('#currentDuration').text());
};

Connector.trackArtSelector = '.rightSide .albumArtWrapper img';

Connector.getUniqueID = function() {
	var optionsHref = $('.buttonOption.main[title=Options]').attr('href');
	if (optionsHref) {
		return optionsHref.replace(/[\w|\W]+adriveId=/, '');
	}
	return null;
};
