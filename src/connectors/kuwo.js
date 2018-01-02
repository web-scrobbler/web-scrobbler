'use strict';

function setupConnector() {
	setupCommonProperties();

	if (isDefaultPlayer()) {
		setupDefaultPlayer();
	} else if (isSinglePlayer()) {
		setupSinglePlayer();
	} else {
		setupMobilePlayer();
	}
}

function isSinglePlayer() {
	return $('#musiclrc').length > 0;
}

function setupCommonProperties() {
	Connector.playerSelector = '#playerBox';

	Connector.currentTimeSelector = '#wp_playTime';

	Connector.isPlaying = () => $('#wp_playBtn').hasClass('zan');
}

function isDefaultPlayer() {
	return $('#player').length > 0;
}

function setupDefaultPlayer() {
	Connector.trackSelector = '.current .name>a';

	Connector.albumSelector = '.current .album';

	Connector.artistSelector = '.current .artist';

	Connector.getUniqueID = () => $('.current').attr('id').substr(8);
}

function setupSinglePlayer() {
	Connector.trackSelector = '#lrcName';

	Connector.albumSelector = '.album a';

	Connector.artistSelector = '.artist a';

	Connector.getUniqueID = () => {
		let params = JSON.parse($('#PLOAD_PARAM').val());
		return params.mid;
	};
}

function setupMobilePlayer() {

	Connector.playerSelector = '.playbox';

	Connector.playButtonSelector = '#single_playbtn';

	Connector.isPlaying = () => {
		let text = $('#single_playbtn').css('background-image');
		return text.includes('pause');
	};

	Connector.trackArtSelector = '.single_pic img';

	Connector.trackSelector = '#down_single_sname';

	Connector.artistSelector = '#down_single_aname';

	Connector.currentTimeSelector = '#currtime';

	Connector.durationSelector = '#totaltime';

	Connector.getUniqueID = () => {
		let params = JSON.parse($('.playing').attr('jsontext').replace(/'/g, '"'));
		return params.mid;
	};
}

setupConnector();
