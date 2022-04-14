'use strict';

// only works on mixes via https://burntable.com/listen or user playlists; album playback limited to 60-second increments

Connector.playerSelector = '.universal-player';

Connector.getTrackInfo = () => {
	let albumText;
	let artistText;
	let trackText;

	const artistAlbumText = Util.getTextFromSelectors('.universal-player .magic-marquee .magic-marquee-content > span > span:last-of-type');

	if (artistAlbumText !== null) { // ensure text captured
		const artistAlbumSplit = artistAlbumText.split(' \u2013 '); // en dash separator
		albumText = artistAlbumSplit[1];
		artistText = artistAlbumSplit[0];
	}

	const trackTextElement = document.querySelector('.universal-player .magic-marquee .magic-marquee-content > span');

	if (trackTextElement !== null) { // ensure element loaded
		trackText = trackTextElement.childNodes[1].textContent; // get text without span siblings
	}

	return {
		album: albumText,
		artist: artistText,
		track: trackText,
	};
};

const filter = MetadataFilter.createFilter({
	album: (text) => text.replace(/\s\((\d{4})?\)$/g, ''), // remove year of vinyl pressing
});

Connector.applyFilter(filter);

Connector.trackArtSelector = '.universal-player .v-image__image--cover';

Connector.playButtonSelector = '.universal-player button.v-size--large i.mdi-play';
