export {};

// Hang.FM connector
// two sources for playing information supported:
// - stage view
// - popup view on navigation, for example going back to the home page

const filter = MetadataFilter.createFilter({
	artist: trimTrailingSeparator,
});

function trimTrailingSeparator(text: string) {
	return text.replace(/ \u2013 $/, '');
}

const playerDisplay = '#NowPlaying button > span';
const timeDiv = `${playerDisplay} > div:last-child`;

// listen on all updates on the entire page (for navigation)
Connector.playerSelector = '.App';

// this element doesn't exist in the popup if nothing is playing
const popupImageWrapper = 'video+div div:has(>button[id^=radix-])';

Connector.pauseButtonSelector = ['#NowPlaying button', popupImageWrapper];

Connector.getArtistTrack = () => {
	const elems = Util.queryElements(
		`${playerDisplay} > div:first-child > span:first-child`,
	);

	if (!elems?.length) {
		// take from popup if stage view not available
		const popupElements = document.querySelectorAll(
			`${popupImageWrapper} >div>div:last-child [speed]>:first-child`,
		);
		if (popupElements.length !== 2) {
			return null;
		}
		const [title, artist] = Array.from(popupElements).map(
			(elem) => elem.textContent,
		);
		return { artist, track: title };
	}

	for (const elem of elems) {
		if (elem.childNodes.length === 2) {
			// The artist/title box has two textNodes,
			// so use those if we have them
			return {
				artist: elem.firstChild!.textContent,
				track: elem.lastChild!.textContent,
			};
		}

		// Otherwise fall back to trying to split using the default splitter
		const artistTrack = Util.splitArtistTrack(elem.innerText);
		if (artistTrack.artist && artistTrack.track) {
			return artistTrack;
		}
	}
};

Connector.currentTimeSelector = [
	`${timeDiv} > div:first-child`,
	`${popupImageWrapper}+div>div:last-child>:first-child`,
];
Connector.durationSelector = [
	`${timeDiv} > div:last-child`,
	`${popupImageWrapper}+div>div:last-child>:last-child`,
];

// image behind the stage / click surface in the popup
Connector.trackArtSelector = [
	'div:has(>#NowPlaying)>div>img[src*="artwork-cdn.7static.com"]',
	`${popupImageWrapper}>button[id^=radix-]>img`,
];

// the like button in stage(bottom)/popup. the dislike button doesn't map to our binary metric
// the star button would be a better fit but that's in a submenu in the stage view.
Connector.loveButtonSelector = [
	'button img[alt="Approve"]:not([src*="pressed"])',
	`${popupImageWrapper} button.like:not(.active)`,
];
Connector.unloveButtonSelector = [
	'button img[alt="Approve"][src*="pressed"]',
	`${popupImageWrapper} button.like.active`,
];

Connector.applyFilter(filter);
