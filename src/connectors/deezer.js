'use strict';

setupConnector();

function setupConnector() {
	if (isNewDeezer()) {
		setupNewDeezer();
	} else {
		setupOldDeezer();
	}
	Connector.filter = MetadataFilter.getRemasteredFilter().extend(MetadataFilter.getDoubleTitleFilter());
}

function isNewDeezer() {
	return $('body').hasClass('electron-ui');
}

function setupNewDeezer() {
	Connector.playerSelector = 'div#page_player';

	Connector.getArtist = () => {
		let artists;
		if ($('div.track-title').length > 0) { // from player
			artists = $('div.track-title a.track-link').toArray();
			artists.shift();
		} else { // from open queuelist
			artists = $('div.queuelist-cover-title a.queuelist-cover-link').toArray();
		}
		return Util.joinArtists(artists);
	};

	Connector.getTrack = () => {
		let track;
		if ($('div.track-title').length > 0) { // from player
			track = $('div.track-title a.track-link:eq(0)').text();
		} else { // from open queuelist
			track = $('div.queuelist-cover-subtitle a.queuelist-cover-link').text();
		}
		return track;
	};

	Connector.currentTimeSelector = '.slider-counter.slider-counter-current';

	Connector.durationSelector = '.slider-counter.slider-counter-max';

	Connector.getTrackArt = () => {
		let trackArtUrl = $('button.queuelist .picture-img.active').attr('src');
		return trackArtUrl.replace('/28x28-', '/264x264-');
	};

	Connector.isPlaying = () => $('.player-controls .svg-icon.svg-icon-pause').length > 0;
}

function setupOldDeezer() {
	Connector.playerSelector = '#page_sidebar';

	Connector.getArtist = () => {
		let artists = $('.player-track-artist').children().toArray();
		return Util.joinArtists(artists);
	};

	Connector.trackSelector = '.player-track-title';

	Connector.currentTimeSelector = '.player-progress .progress-time';

	Connector.durationSelector = '.player-progress .progress-length';

	Connector.trackArtSelector = '.player-cover img';

	Connector.isPlaying = () => $('#player .svg-icon-pause').length > 0;
}
