'use strict';

Connector.playerSelector = '.site-player'; // supports main and mini players

const filter = MetadataFilter.createFilter({
	track: (text) => text.replace(/[‘’“”]/g, ''), // filter for Today's Top Tune
});

Connector.getTrackInfo = () => {
	const metaSelector = '.site-player .meta';
	const showNameText = Util.getTextFromSelectors(`${metaSelector} .show-name`);
	const artistText = Util.getTextFromSelectors(`${metaSelector} .episode-name`);
	const trackText = Util.getTextFromSelectors(`${metaSelector} .song-name`);

	if (Util.hasElementClass(metaSelector, 'music') && trackText && !artistText.includes('[BREAK]')) {
		return {
			artist: artistText,
			track: trackText,
		};

	} else if (!Util.hasElementClass(metaSelector, 'music') && artistText && showNameText.includes('Today\'s Top Tune')) {
		return Util.splitArtistTrack(artistText, [': ']);
	}

	return null;
};

Connector.applyFilter(filter);

Connector.isPlaying = () => Util.hasElementClass('button.play', 'active');
