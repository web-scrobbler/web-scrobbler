'use strict';

const defaultAlbumData = {
	path: undefined,
	loaded: false,
	name: undefined
};

const playerSelector = '#JooxPlayerWrapper';
const artistSelector = `${playerSelector} .Artist a`;
const trackSelector = '#songDetail .SongName';
const playBtnSelector = '#playBtn';

const getTrackPath = () => $(`${trackSelector} a`).attr('href');
const getTrackUrl = () => `https://www.joox.com${getTrackPath()}`;
const initiateAlbumDataCache = (trackPath) => {
	let data = Object.assign({}, defaultAlbumData);
	return Object.assign(data, { path: trackPath });
};
const isAlbumDataInCache = (albumData, trackPath) => albumData.path === trackPath;
const isAlbumDataLoaded = (albumData) => albumData.loaded;
const loadAlbumData = (onLoadComplete) => {
	$.get({
		url: getTrackUrl(),
		success: (data) => {
			let ldJSON = $.parseHTML(data)
				.filter((el) => el.tagName === 'SCRIPT')[0]
				.innerText;
			let songData = JSON.parse(ldJSON);
			onLoadComplete(songData);
		},
	});
	return true;
};
let _albumData = initiateAlbumDataCache(undefined);

// Connector methods

Connector.playerSelector = playerSelector;
Connector.trackSelector = '#songDetail .SongName';
Connector.currentTimeSelector = `${playerSelector} .Status .start`;
Connector.durationSelector = `${playerSelector} .Status .end`;
Connector.trackArtSelector = `${playerSelector} .rezyImageFrame img`;
Connector.getUniqueID = getTrackUrl;

Connector.getArtist = () => {
	return $(artistSelector)
		.map((_, el) => $(el).text())
		.get()
		.join(', ');
};

Connector.isPlaying = () => $(playBtnSelector).find('i:first').hasClass('icon--pause');

Connector.getAlbum = () => {
	const trackPath = getTrackPath();

	if (!isAlbumDataInCache(_albumData, trackPath)) {
		_albumData = initiateAlbumDataCache(trackPath);
	}

	if (!isAlbumDataLoaded(_albumData)) {
		_albumData.loaded = loadAlbumData((songData) => _albumData.name = songData.inAlbum.name);
	}

	return _albumData.name;
};
