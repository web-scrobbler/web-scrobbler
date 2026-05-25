export {};

const filter = MetadataFilter.createFilter({
	artist: trimTrailingSeparator,
});

function trimTrailingSeparator(text: string) {
	return text.replace(/ – $/, '');
}

const playerDisplay = '#NowPlaying button > span';
const timeDiv = `${playerDisplay} > div:last-child`;

Connector.playerSelector = 'div:has(> #NowPlaying)';

Connector.pauseButtonSelector = '#NowPlaying button';

Connector.getArtistTrack = () => {
	const elems = Util.queryElements(`${playerDisplay} > div:first-child > span:first-child`);

	if (!elems) {
		return null;
	}

	for (let elem of elems) {
		if (elem.childNodes.length == 2) {
			// The artist/title box has two textNodes,
			// so use those if we have them
			return {
				artist: elem.firstChild.textContent,
				track: elem.lastChild.textContent,
			};
		} else {
			// Otherwise fall back to trying to split using the default splitter
			let artistTrack = Util.splitArtistTrack(elem.innerText);
			if (artistTrack.artist && artistTrack.track) {
				return artistTrack;
			}
		}
	}
};

Connector.currentTimeSelector = `${timeDiv} > div:first-child`;
Connector.durationTimeSelector = `${timeDiv} > div:last-child`;

Connector.loveButtonSelector =
	'button img[alt="Approve"]:not([src*="pressed"])';
Connector.unloveButtonSelector = 'button img[alt="Approve"][src*="pressed"]';

Connector.applyFilter(filter);
