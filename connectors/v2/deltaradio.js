'use strict';

/* global Connector */

Connector.playerSelector = '#mainWrapper';

Connector.getArtist = function() {
	if (isPlaying()) {
		return $('#ActiveTitle .meta .artist').text();
	}

    return null;
};

Connector.getTrack = function() {
	if (isPlaying()) {
        return $('#ActiveTitle .meta .title').text();
	}

    return null;
};



function isPlaying() {
    return musicIsPlaying() && checkPlayButtonIsStop() && checkTitle();
}

Connector.isPlaying = isPlaying;

function checkPlayButtonIsStop() {
	return $('#BtnPlayPause a').hasClass('stop');
}

function musicIsPlaying() {
	return $('#ActiveTitle .meta .title').text() !== 'www.deltaradio.de';
}

function checkTitle() {
    return $('#ActiveTitle h3').text() !== 'Als nächstes läuft';
}
