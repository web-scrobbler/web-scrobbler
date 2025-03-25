export {};

Connector.playerSelector = '#main';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.songtitle';

Connector.pauseButtonSelector = '.audioplayer-playing';

const filter = MetadataFilter.createFilter({
	artist: (artist) => {
		// If the artist string contains a semicolon, split the string by the semicolon
		// and return the first element (the part of the string before the semicolon).

		// Replace .feat with a semicolon
		const updatedArtist = artist.replace('.feat', ';');

		// Example: "Artist1; Artist2" -> "Artist1"
		if (updatedArtist.includes(';')) {
			return updatedArtist.split(';')[0].trim();
		}
		// If there is no semicolon, return the original artist string.
		return updatedArtist.trim();
	},
});

Connector.applyFilter(filter);
