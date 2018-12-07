'use strict';

const filter = new MetadataFilter({ album: MetadataFilter.decodeHtmlEntities });

Connector.playerSelector = '#dragonflyTransport .rightSide';

Connector.getArtist = () => {
	return $('.trackInfoContainer .trackArtist a, .trackInfoContainer .trackArtist span').attr('title');
};

Connector.trackSelector = '.trackInfoContainer .trackTitle';

Connector.getAlbum = () => {
	if ($('tr.selectable.currentlyPlaying td.albumCell')) {
		return $('tr.selectable.currentlyPlaying td.albumCell').attr('title');
	}

	if ($('.nowPlayingDetail img.albumImage')) {
		return $('.nowPlayingDetail img.albumImage').att('title');
	}

	if ($('.trackSourceLink a').data('ui-click-action') === 'selectAlbum') {
		return $('.trackSourceLink a').attr('title');
	}
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

Connector.applyFilter(filter);
