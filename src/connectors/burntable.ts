'use strict';

/*
 * connector only works on mixes via https://burntable.com/listen or user playlists;
 * full album playback limited to 60-second increments due to licensing restrictions
 */

const filter = MetadataFilter.createFilter({ album: removePressingYear });

const trackInfoWrapper = '.magic-marquee .magic-marquee-content';

Connector.playerSelector = '.universal-player';

Connector.trackArtSelector = `${Connector.playerSelector} .v-image__image--cover`;

Connector.getTrack = () => {
	const trackTextElement = document.querySelector(`${trackInfoWrapper} > span`);

	if (trackTextElement) {
		return trackTextElement.childNodes[1].textContent; // get text without span siblings
	}

	return null;
};

Connector.getTrackInfo = () => {
	const artistAlbumText = Util.getTextFromSelectors(`${trackInfoWrapper} > span > span:last-of-type`);

	if (artistAlbumText) {
		return Util.splitArtistAlbum(artistAlbumText, [' \u2013 ']);
	}

	return null;
};

Connector.isPlaying = () => {
	const playButtonSelector = `${Connector.playerSelector} button.v-size--large`;

	return (
		Util.isElementVisible(`${playButtonSelector} .mdi-pause`) &&
		!Util.hasElementClass(playButtonSelector, 'v-btn--loading')
	);
};

Connector.applyFilter(filter);

function removePressingYear(text) {
	return text.replace(/\s\((\d{4})?\)$/, '');
}
