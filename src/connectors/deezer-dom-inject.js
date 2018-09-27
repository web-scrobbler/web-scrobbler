'use strict';

const DEEZER_MAIN_ARTIST = '0';
const DEEZER_FEATURED_ARTIST = '5';

initConnector();

function initConnector() {
	let retries = 0;
	if (window.dzPlayer && window.Events) {
		addEventListeners();
	} else if (retries < 6) {
		window.setTimeout(function() {
			initConnector();
			retries++;
		}, 1007);
	} else {
		console.log('web-scrobbler: Failed to initialize deezer connector!');
	}
}

function addEventListeners() {
	const ev = window.Events;
	ev.subscribe(ev.player.play, sendEvent);
	ev.subscribe(ev.player.paused, sendEvent);
	ev.subscribe(ev.player.resume, sendEvent);
}

function sendEvent() {
	window.postMessage({
		sender: 'web-scrobbler',
		type: 'DEEZER_STATE',
		state: getState()
	}, '*');
}

function getState() {
	const player = window.dzPlayer;
	const item = player.getCurrentSong();

	return {
		artist: lastfmifyArtists(item),
		title: lastfmifyTitle(item),
		album: item.ALB_TITLE,
		duration: player.getDuration(),
		currentTime: player.getPosition(),
		uniqueId: item.SNG_ID,
		isPlaying: player.isPlaying(),
		trackArt: getTrackArt(item.ALB_PICTURE),
		artists: item.ARTISTS
	};
}

function getTrackArt(pic) {
	return `https://e-cdns-images.dzcdn.net/images/cover/${pic}/264x264-000000-80-0-0.jpg`;
}

function lastfmifyArtists(item) {
	let artists = item.ARTISTS;
	artists = getArtistsnamesByRole(item, DEEZER_MAIN_ARTIST);
	if (artists.length <= 1) {
		return item.ART_NAME;
	}

	return getArtistsList(artists);
}

function lastfmifyTitle(item) {
	let title = item.SNG_TITLE;
	if (item.VERSION !== '') {
		title = `${title} ${item.VERSION}`;
	}

	// don't add featured artists from the item object to the title
	// if there is already feature information included
	if (title.search(/\s[([]?[f|F](eat\.|eaturing)\s([^ ]+)/i) !== -1) {
		return title;
	}

	let artists = getArtistsnamesByRole(item, DEEZER_FEATURED_ARTIST);
	if (artists.length === 0) {
		return title;
	}

	return `${title} (feat. ${getArtistsList(artists)})`;
}

function getArtistsnamesByRole(item, roleId) {
	return item.ARTISTS.filter((a) => a.ROLE_ID === roleId) // 0: main artist; 5: featured artist
		.sort((a, b) => a.ARTISTS_SONG_ORDER < b.ARTISTS_SONG_ORDER) // respect ordering
		.map((a) => a.ART_NAME) // array of artistnames from array of items
		.filter(removeDuplicateArtists);
}

function removeDuplicateArtists(artist, index, artists) {
	// make sure an artistname is not a comma- or ampersand-seperated list
	// of artistnames which are already included in the artists array
	let dupes = artist.split(/\s&\s|\sand\s/i);
	return dupes.length === 1 || !dupes.every((a) => artists.includes(a));
}

function getArtistsList(artists) {
	// concat artists with ',' but last artist with '&'
	return artists.reduce(function concatArtists(string, artist, index, arr) {
		return string + (arr.length === index + 1 ? ' & ' : ', ') + artist;
	});
}
