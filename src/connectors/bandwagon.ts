export {};

Connector.pauseButtonSelector = 'button.media-Play';
Connector.pauseButtonSelector = 'button.media-Pause';

const stripPrefixAndTrim = (prefix: string) => (str: string) => {
	if (str.startsWith(prefix)) str = str.substring(prefix.length);
	return str.trim();
};

if (document.querySelector('#main>[id*="track-"]')) {
	// track page
	Connector.getUniqueID = () => {
		return document.URL.substring(window.origin.indexOf('://') + 3);
	};

	Connector.playerSelector = ':has(>#media-controls)';

	Connector.trackArtSelector = '#track-icon';

	const filter = MetadataFilter.createFilter({
		track: stripPrefixAndTrim('Track Name:'),
		artist: stripPrefixAndTrim('Artist:'),
		album: stripPrefixAndTrim('Album:'),
		albumArtist: stripPrefixAndTrim('Artist:'),
	});
	Connector.applyFilter(filter);

	Connector.trackSelector = '#track-name';
	Connector.artistSelector = '#track-attributedTo';
	Connector.albumSelector = '#track-album';

	Connector.durationSelector = '#track-length';
	Connector.getTimeInfo = () => {
		let elem: Node | null = document.querySelector(
			Connector.durationSelector as string,
		);
		elem = elem?.childNodes[elem?.childNodes.length - 1] ?? elem;
		const duration = Util.stringToSeconds(elem?.textContent);
		const progress = document
			.querySelector('#media-Progress')
			?.getAttribute('value');
		const currentTime = ((progress ? +progress : 0) / 100) * duration;
		return {
			duration,
			currentTime,
		};
	};
	Connector.loveButtonSelector = 'button .bi-heart';
	Connector.unloveButtonSelector = 'button .bi-heart-fill';

	Connector.albumArtistSelector = Connector.artistSelector;
} else if (document.querySelector('#main>[id*="album-"]')) {
	// album page
	Connector.playerSelector = ['#media-controls', '#album-tracks'];

	// is this correct? it's the album artwork, not the track artwork...
	Connector.trackArtSelector = '#album-icon';

	const filter = MetadataFilter.createFilter({
		album: stripPrefixAndTrim('Album Name:'),
		// technically currently unnecessary, but who knows
		artist: stripPrefixAndTrim('Artist:'),
		albumArtist: stripPrefixAndTrim('Artist:'),
	});
	Connector.applyFilter(filter);

	Connector.albumSelector = '#album-name';
	Connector.albumArtistSelector = '#album-attributedTo';

	Connector.getUniqueID = () => {
		const trackPath = Util.getAttrFromSelectors(
			'#album-tracks .playing>div:last-child a',
			'href',
		);
		if (!trackPath) return null;
		const domain = window.origin.substring(
			window.origin.indexOf('://') + 3,
		);
		return domain + trackPath;
	};

	Connector.trackSelector = '#album-tracks .playing>div>div:last-child';

	Connector.artistSelector = Connector.albumArtistSelector;
}
