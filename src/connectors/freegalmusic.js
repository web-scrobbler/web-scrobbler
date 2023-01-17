'use strict';

const filter = MetadataFilter.createFilter({
	artist: extractPrimaryArtist,
	track: [removeParody, removeRemaster, replaceSmartQuotes],
});

Connector.playerSelector = '#player-section';

Connector.artistSelector = `${Connector.playerSelector} .fp-message .artist-name`;

Connector.trackSelector = `${Connector.playerSelector} .fp-message .song-name`;

Connector.trackArtSelector = `${Connector.playerSelector} .album-image img`;

Connector.currentTimeSelector = `${Connector.playerSelector} .fp-elapsed`;

Connector.durationSelector = `${Connector.playerSelector} .fp-duration`;

Connector.isPlaying = () => Util.hasElementClass('#fp-audio', 'is-playing');

Connector.applyFilter(filter);

function extractPrimaryArtist(text) {
	// only return first artist if semicolon/comma-separated list of contributors
	return text.split(/(;|((?<!\d),))(?!\s)/)[0];
}

function removeParody(text) {
	return text.replace(/\s?\((Parody|Lyrical Adaption) of.*\)/i, '');
}

function removeRemaster(text) {
	return text.replace(/\s?(\(|\[)[\s\w]*Re-?master(ed)?[\s\w]*(\)|\])/gi, '');
}

function replaceSmartQuotes(text) {
	return text.replace(/[\u2018\u2019]/g, '\'').replace(/[\u201c\u201d]/g, '"');
}
