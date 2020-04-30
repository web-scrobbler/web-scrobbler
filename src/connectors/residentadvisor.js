'use strict';

// https://www.residentadvisor.net/tracks ("Popular tracks" at the top)
// https://www.residentadvisor.net/tracks/931382 ("Popular tracks" at the bottom)
const TYPE_POPULAR = 'Popular tracks';

// https://www.residentadvisor.net/tracks ("Archived tracks" in the middle)
const TYPE_ARCHIVED = 'Archived tracks';

// https://www.residentadvisor.net/tracks/931382 ("Single track" in the middle)
const TYPE_SINGLE = 'Single track';

// https://www.residentadvisor.net/record-label.aspx?id=15687&show=tracks (Label tracks)
// https://www.residentadvisor.net/dj/hotsince82/tracks (DJ tracks)
const TYPE_DJ_OR_LABEL = 'DJ tracks or label tracks';

// https://www.residentadvisor.net/dj/secretsundaze/top10?chart=214484 (Chart tracks)
const TYPE_CHART = 'Chart track';

const TYPE_UNKNOWN = 'Unknown player';

Connector.playerSelector = '.content-list';

// This identifies the track element depending on the parents of the play button
function getTrackContainer() {
	// Iterate through all parents until it also finds a cover art
	const playButtons = document.querySelectorAll('.play.paused');
	for (const button of playButtons) {
		let currentNode = button;

		// eslint-disable-next-line no-cond-assign
		while (currentNode = currentNode.parentElement) {
			if (currentNode.querySelector('img[src^="/images/cover/"]') !== null) {
				return currentNode;
			}
		}
	}

	return null;
}

function getTrackType(trackContainer) {
	const containerTagName = trackContainer.tagName.toLowerCase();

	if (containerTagName === 'article') {
		return TYPE_POPULAR;
	} else if (containerTagName === 'ul') {
		return TYPE_ARCHIVED;
	} else if (containerTagName === 'div') {
		return TYPE_SINGLE;
	}

	const parentContainer = trackContainer.parentNode;
	if (containerTagName === 'li') {
		if (parentContainer.classList.contains('tracks')) {
			return TYPE_DJ_OR_LABEL;
		} else if (parentContainer.classList.contains('chart')) {
			return TYPE_CHART;
		}
	}

	return TYPE_UNKNOWN;
}

Connector.getTrackInfo = () => {
	const trackContainer = getTrackContainer();
	if (!trackContainer) {
		return null;
	}

	let track = null;
	let artist = null;
	let trackArt = null;
	let uniqueID = null;

	switch (getTrackType(trackContainer)) {
		case TYPE_POPULAR: {
			const artistTrack = trackContainer.querySelector('div a');
			if (artistTrack !== null) {
				const artistTrackStr = artistTrack.textContent;
				({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			}
			break;
		}

		case TYPE_SINGLE: {
			const artistTrackStr = Util.getTextFromSelectors('#sectionHead h1');
			({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			break;
		}

		case TYPE_DJ_OR_LABEL: {
			const titleElement = trackContainer.querySelector('.title');
			if (titleElement) {
				const linkElements = titleElement.querySelectorAll('a');
				if (linkElements.length > 1) {
					artist = linkElements[1].textContent;
					track = linkElements[0].textContent;
				}
			}
			break;
		}

		case TYPE_CHART: {
			const artistNode = trackContainer.querySelector('.artist a');
			const trackNode = trackContainer.querySelector('.track a');

			artist = artistNode && artistNode.textContent;
			track = trackNode && trackNode.textContent;
			break;
		}

		case TYPE_ARCHIVED: {
			const artistNode = trackContainer.querySelector('li:last-child .pr8 div.f24');
			const trackNode = trackContainer.querySelector('li:last-child .pr8 a.f24');

			artist = artistNode && artistNode.textContent;
			track = trackNode && trackNode.textContent;
			break;
		}

		case TYPE_UNKNOWN:
			return null;
	}

	const trackArtElement = trackContainer.querySelector('img[src^="/images/cover/"]');
	if (trackArtElement) {
		trackArt = trackArtElement.src;
	}
	const uniqueIdElement = trackContainer.querySelector('.play.player');
	if (uniqueIdElement) {
		uniqueID = uniqueIdElement.getAttribute('data-trackid');
	}

	return { artist, track, uniqueID, trackArt };
};

Connector.pauseButtonSelector = '.play.paused';

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl.endsWith('images/cover/blank.jpg');
};
