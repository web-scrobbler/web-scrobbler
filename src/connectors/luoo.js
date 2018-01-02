'use strict';

setupConnector();

function setupConnector() {
	let playerSelectors = [
		'#luooPlayerPlaylist.vol-tracklist',
		'.musician-banner, .musician-wrapper',
		'.item [id^=player]'
	];
	let index = playerSelectors.findIndex((playerSelector) => !!$(playerSelector).length);
	if (index > -1) {
		setupCommonProperties();

		Connector.playerSelector = playerSelectors[index];
	}
	switch (index) {
		case 0:
			setupVolEssayPlayer();
			break;
		case 1:
			setupMusicianPlayer();
			break;
		case 2:
			setupSearchPlayer();
	}
}

function setupCommonProperties() {
	$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

	Connector.getCurrentAudio = () => $('audio').get().find((audio) => audio.currentTime && !audio.paused && !audio.ended);

	Connector.getDuration = () => $(Connector.getCurrentAudio()).prop('duration');

	Connector.getCurrentTime = () => $(Connector.getCurrentAudio()).prop('currentTime');

	Connector.isPlaying = () => !!Connector.getCurrentAudio();

	Connector.trackArtSelector = '#jp_poster_0';

	Connector.getCurrentItem = () => $(Connector.pauseButtonSelector).parents(Connector.itemSelector || Connector.playerSelector);

	Connector.getTrack = () => Connector.getCurrentItem().find(Connector.trackSelector).text();

	Connector.getArtist = () => Connector.getCurrentItem().find(Connector.artistSelector).text();

	Connector.getUniqueID = () => Connector.getCurrentItem().find('.icon-fav').data('id');

	Connector.isTrackArtDefault = (trackArtUrl) => trackArtUrl.match(/album/g).length !== 1;
}

function setupVolEssayPlayer() {
	Connector.getArtistTrack = () => {
		let [track, artist] = $('a.jp-playlist-current').contents().map((i, e) => $(e).text().slice(i ? 3 : 0)).get() ||
			Array(2).fill(null);
		return { artist, track };
	};

	Connector.pauseButtonSelector = '.icon-status-pause:visible';

	Connector.itemSelector = 'li.track-item';

	Connector.trackSelector = '.name';

	Connector.artistSelector = '.artist:eq(0)';

	Connector.getAlbum = () => Connector.getCurrentItem().find('.cover').attr('alt');
}

function setupMusicianPlayer() {
	Connector.pauseButtonSelector = '.icon-pause[style*=block]';

	Connector.trackSelector = '.title';

	Connector.artistSelector = '.performer';
}

function setupSearchPlayer() {
	Connector.itemSelector = '.item';

	Connector.pauseButtonSelector = '.icon-search-pause:visible';

	Connector.trackSelector = '.title a';

	Connector.getTrackArt = function() {
		return this.getCurrentItem().find('.rs-pic').attr('src');
	};

	Connector.getAlbumArtist = function() {
		let text = this.getCurrentItem().find('.content').text();
		let [album, artist] = text.trim().split(', ').map((text) => text.replace(/^\S+\s/g, '')) || Array(2).fill(null);
		return { album, artist };
	};

	Connector.getAlbum = () => Connector.getAlbumArtist().album;

	Connector.getArtist = () => Connector.getAlbumArtist().artist;

	Connector.getUniqueID = () => Connector.getCurrentItem().data('id');
}
