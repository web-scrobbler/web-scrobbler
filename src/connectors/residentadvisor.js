'use strict';

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
	$('.play.paused').parents().each((_, parent) => {
		if ($(parent).find('img[src^="/images/cover/"]').length > 0) {
			trackContainer = parent;
			return false;
		}
	});
	return $(trackContainer);
}

function typeOfTrack(trackContainer) {
	if (trackContainer.is('article')) {
		return PLAYER_TYPES.POPULAR;
	} else if (trackContainer.is('ul')) {
		return PLAYER_TYPES.ARCHIVED;
	} else if (trackContainer.is('div')) {
		return PLAYER_TYPES.SINGLE;
	}

	const parentContainer = trackContainer.parent();
	if (trackContainer.is('li')) {
		if (parentContainer.hasClass('tracks')) {
			return PLAYER_TYPES.DJ_OR_LABEL;
		} else if (parentContainer.hasClass('chart')) {
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
			const artistTrackStr = trackContainer.find('div a').text();
			({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			break;
		}
		case PLAYER_TYPES.SINGLE: {
			const artistTrackStr = $('#sectionHead h1').text();
			({ artist, track } = Util.splitArtistTrack(artistTrackStr));
			break;
		}
		case PLAYER_TYPES.DJ_OR_LABEL:
			artist = parseTitle(trackContainer.find('.title'));
			track = trackContainer.find('.title').contents().first().text();
			break;
		case PLAYER_TYPES.CHART:
			artist = trackContainer.find('.artist a').text();
			track = trackContainer.find('.track a').text();
			break;
		case PLAYER_TYPES.ARCHIVED:
			artist = trackContainer.find('li:last-child .pr8 div.f24').first().text();
			track = trackContainer.find('li:last-child .pr8 a.f24').text();
			break;
		case PLAYER_TYPES.UNKNOWN:
			return null;
	}

	const uniqueID = trackContainer.find('.play.player').attr('data-trackid');
	const relTrackArt = trackContainer.find('img[src^="/images/cover/"]').first().attr('src');
	const trackArt = `https://www.residentadvisor.net${relTrackArt}`;

	return { artist, track, uniqueID, trackArt };
};

Connector.isPlaying = () => $('.play.paused').length > 0;

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl === `${domain}/images/cover/blank.jpg`;
};

function parseTitle(title) {
	const contents = title.contents();
	const track = contents.eq(0).text();
	const titleWithoutTrack = contents.text().replace(track, '');
	let artist = titleWithoutTrack.substr(3, titleWithoutTrack.length);
	if (artist.indexOf(' on ') >= 0) {
		// label remains i.e. "Daft Punk on Foo Recordings"
		artist = artist.substr(0, artist.indexOf(' on '));
	}
	return artist;
}
