'use strict';

Connector.playerSelector = '#dragonflyTransport .rightSide';

Connector.getArtist = () => {
	return $('.trackInfoContainer .trackArtist a, .trackInfoContainer .trackArtist span').attr('title');
};

Connector.trackSelector = '.trackInfoContainer .trackTitle';

Connector.albumSelector = '.trackSourceLink a';

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

Connector.applyFilter(MetadataFilter.getAmazonFilter());
