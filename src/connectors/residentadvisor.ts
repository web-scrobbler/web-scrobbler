export {};

const domain = 'https://www.residentadvisor.net';

const PLAYER_TYPES = {
	// https://www.residentadvisor.net/tracks ("Popular tracks" at the top)
	// https://www.residentadvisor.net/tracks/931382 ("Popular tracks" at the bottom)
	POPULAR: 'Popular tracks',
	// https://www.residentadvisor.net/tracks ("Archived tracks" in the middle)
	ARCHIVED: 'Archived tracks',
	// https://www.residentadvisor.net/tracks/931382 ("Single track" in the middle)
	SINGLE: 'Single track',
	// https://www.residentadvisor.net/record-label.aspx?id=15687&show=tracks (Label tracks)
	// https://www.residentadvisor.net/dj/hotsince82/tracks (DJ tracks)
	DJ_OR_LABEL: 'DJ tracks or label tracks',
	// https://www.residentadvisor.net/dj/secretsundaze/top10?chart=214484 (Chart tracks)
	CHART: 'Chart track',

	UNKNOWN: 'Player not found',
};

Connector.playerSelector = '.content-list';

// This identifies the track element depending on the parents of the play button
function getTrackContainer() {
	let trackContainer;
	// Iterate through all parents until it also finds a cover art
	let cur = document.querySelector('.play.paused');
	while (!trackContainer && cur) {
		cur = cur.parentElement;
		if (cur?.querySelector('img[src^="/images/cover/"]')) {
			trackContainer = cur;
			break;
		}
	}
	return trackContainer;
}

function typeOfTrack(trackContainer?: Element) {
	if (!trackContainer) {
		Util.debugLog('Player not found', 'warn');
		return PLAYER_TYPES.UNKNOWN;
	}
	if (trackContainer.tagName === 'article') {
		return PLAYER_TYPES.POPULAR;
	} else if (trackContainer.tagName === 'ul') {
		return PLAYER_TYPES.ARCHIVED;
	} else if (trackContainer.tagName === 'div') {
		return PLAYER_TYPES.SINGLE;
	}

	const parentContainer = trackContainer.parentElement;
	if (trackContainer.tagName === 'li') {
		if (parentContainer?.classList.contains('tracks')) {
			return PLAYER_TYPES.DJ_OR_LABEL;
		} else if (parentContainer?.classList.contains('chart')) {
			return PLAYER_TYPES.CHART;
		}
	}

	Util.debugLog('Player not found', 'warn');
	return PLAYER_TYPES.UNKNOWN;
}

Connector.getTrackInfo = () => {
	let artist = null;
	let track = null;

	const trackContainer = getTrackContainer();
	switch (typeOfTrack(trackContainer)) {
		case PLAYER_TYPES.POPULAR: {
			const artistTrackStr =
				trackContainer?.querySelector('div a')?.textContent;
			({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			break;
		}
		case PLAYER_TYPES.SINGLE: {
			const artistTrackStr = Util.getTextFromSelectors('#sectionHead h1');
			({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			break;
		}
		case PLAYER_TYPES.DJ_OR_LABEL:
			artist = parseTitle(trackContainer?.querySelector('.title'));
			track = (trackContainer?.querySelector('.title') as HTMLElement)
				.innerText;
			break;
		case PLAYER_TYPES.CHART:
			artist = trackContainer?.querySelector('.artist a')?.textContent;
			track = trackContainer?.querySelector('.track a')?.textContent;
			break;
		case PLAYER_TYPES.ARCHIVED:
			artist = trackContainer?.querySelector('li:last-child .pr8 div.f24')
				?.textContent;
			track = trackContainer?.querySelector('li:last-child .pr8 a.f24')
				?.textContent;
			break;
		case PLAYER_TYPES.UNKNOWN:
			return null;
	}

	const uniqueID = trackContainer
		?.querySelector('.play.player')
		?.getAttribute('data-trackid');
	const relTrackArt = trackContainer
		?.querySelector('img[src^="/images/cover/"]')
		?.getAttribute('src');
	const trackArt = `https://www.residentadvisor.net${relTrackArt}`;

	return { artist, track, uniqueID, trackArt };
};

Connector.isPlaying = () => Boolean(document.querySelector('.play.paused'));

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl === `${domain}/images/cover/blank.jpg`;
};

function parseTitle(title?: Element | null) {
	const contents = title?.childNodes;
	const track = contents?.[0].textContent;
	const titleWithoutTrack = [...(contents ?? [])]
		.map((e) => {
			e.textContent;
		})
		.join('')
		.replace(track ?? '', '');
	let artist = titleWithoutTrack.substr(3, titleWithoutTrack.length);
	if (artist.indexOf(' on ') >= 0) {
		// label remains i.e. "Daft Punk on Foo Recordings"
		artist = artist.substr(0, artist.indexOf(' on '));
	}
	return artist;
}
