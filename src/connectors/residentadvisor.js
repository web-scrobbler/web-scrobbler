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

	UNKNOWN: 'Player not found'
};

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

// This identifies the track element depending on the parents of the play button
function getTrackContainer() {
	let track;
	// Iterate through all parents until it also finds a cover art
	$('.play.paused').parents().each((_i, parent) => {
		if ($(parent).find('img[src^="/images/cover/"]').length > 0) {
			track = parent;
			return false;
		}
	});
	return track;
}

function typeOfTrack(trackContainer) {
	if ($(trackContainer).is('article')) {
		return PLAYER_TYPES.POPULAR;
	}
	if ($(trackContainer).is('ul')) {
		return PLAYER_TYPES.ARCHIVED;
	}
	if ($(trackContainer).is('div')) {
		return PLAYER_TYPES.SINGLE;
	}
	if ($(trackContainer).is('li') && $(trackContainer).parent().hasClass('tracks')) {
		return PLAYER_TYPES.DJ_OR_LABEL;
	}
	if ($(trackContainer).is('li') && $(trackContainer).parent().hasClass('chart')) {
		return PLAYER_TYPES.CHART;
	}

	Util.debugLog('Player not found', 'warn');
	return PLAYER_TYPES.UNKNOWN;
}

Connector.getTrack = () => {
	let track = getTrackContainer();
	switch (typeOfTrack(track)) {
		case PLAYER_TYPES.POPULAR:
			return Util.splitArtistTrack($(track).find('div a').text()).track;
		case PLAYER_TYPES.SINGLE:
			return Util.splitArtistTrack($('#sectionHead h1').text()).track;
		case PLAYER_TYPES.DJ_OR_LABEL:
			return $(track).find('.title').contents().first().text();
		case PLAYER_TYPES.CHART:
			return $(track).find('.track a').text();
		case PLAYER_TYPES.ARCHIVED:
			return $(track).find('li:last-child .pr8 a.f24').text();
	}
};

Connector.getArtist = () => {
	let track = getTrackContainer();
	switch (typeOfTrack(track)) {
		case PLAYER_TYPES.POPULAR:
			return Util.splitArtistTrack($(track).find('div a').text()).artist;
		case PLAYER_TYPES.SINGLE:
			return Util.splitArtistTrack($('#sectionHead h1').text()).artist;
		case PLAYER_TYPES.DJ_OR_LABEL:
			return parseTitle($(track).find('.title'));
		case PLAYER_TYPES.CHART:
			return $(track).find('.artist a').text();
		case PLAYER_TYPES.ARCHIVED:
			return $(track).find('li:last-child .pr8 div.f24').first().text();
	}
};

Connector.getUniqueId = () => {
	return getTrackContainer().find('.play.player').attr('data-trackid');
};

Connector.isPlaying = () => $('.play.paused').length > 0;

Connector.getTrackArt = () => {
	return `https://www.residentadvisor.net${$(getTrackContainer()).find('img[src^="/images/cover/"]').first().attr('src')}`;
};

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl === `${domain}/images/cover/blank.jpg`;
};

function parseTitle(title) {
	let contents = title.contents();
	let track = contents.eq(0).text();
	let titleWithoutTrack = contents.text().replace(track, '');
	let artist = titleWithoutTrack.substr(3, titleWithoutTrack.length);
	if (artist.indexOf(' on ') >= 0) {
		// label remains i.e. "Daft Punk on Foo Recordings"
		artist = artist.substr(0, artist.indexOf(' on '));
	}
	return artist;
}
