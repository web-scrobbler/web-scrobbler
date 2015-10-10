'use strict';

/* global Connector */

var version = $('body').hasClass('navia') ? 'new' : 'legacy';
switch (version) {
	case 'new':
		bindNew();
		break;

	case 'legacy':
		bindLegacy();
		break;

	default:
		console.log('Unable to match version. Please report at https://github.com/david-sabata/web-scrobbler/issues');
		break;
}


function bindNew() {

	Connector.playerSelector = '#theatre-ia';

	Connector.artistSelector = '#wrap > div:nth-child(6) > div > div.col-sm-8.thats-left > div:nth-child(3) > span.value';

	Connector.currentTimeSelector = '#jw6_controlbar_elapsed';

	Connector.getAlbum = function() {
		return $('#wrap > div:nth-child(6) > div > div.col-sm-8.thats-left > h1').text().trim() || null;
	};

	Connector.getArtist = function() {
		return parseArtist();
	};

	Connector.getTrack = function() {
		var track =  $('.jwrowV2.playing .ttl').text();

		var parts = track.split('-');
		if (parts.length === 3 && parts[0].trim() === parseArtist()) {
			track = parts[2].trim();
		}

		return track;
	};

	Connector.isPlaying = function() {
		return !$('video')[0].paused;
	};

	Connector.getTrackArt = function() {
		return $('#theatre-ia > div > div > div.row > div.col-xs-12.col-sm-6.col-md-5.col-lg-4 > center > img').attr('src') || null;
	};

	function parseArtist() {
		var artist = $('#wrap > div:nth-child(6) > div > div.col-sm-8.thats-left > div:nth-child(3) > a').text();

		if (artist.length === 0) {
			artist = $('#wrap > div:nth-child(6) > div > div.col-sm-8.thats-left > div:nth-child(3) > span.value > a').text();
		}

		return  artist;
	}
}

function bindLegacy() {

	Connector.playerSelector = '#avplaydiv';

	Connector.currentTimeSelector = '#jw6_controlbar_elapsed';

	Connector.getAlbum = function() {
		var album = $('.x-archive-meta-title').text();

		// Remove artist from album
		var parts = album.split('-');
		if (parts.length > 0 && parts[0].trim() === parseArtist()) {
			album = album.substr(album.indexOf('-') + 1).trim();
		}

		return album;
	};

	Connector.getArtist = function() {
		return parseArtist();
	};

	Connector.getTrack = function() {
		// Get title directly from player
		var title = $('.playing > .ttl').text();

		// Some titles are stored as artist - track # - title so strip out non-title elements
		var parts = title.split('-');
		if (parts.length === 3 && parts[0].trim() === parseArtist()) {
			title = parts[2].trim();
		}

		return title;
	};

	Connector.isPlaying = function() {
		return !$('video')[0].paused;
	};

	Connector.getTrackArt = function() {
		return $('#col1 > div:nth-child(1) > div:nth-child(2) > img').attr('src') || null;
	};

	function parseArtist() {
		return $('span.key:contains("Artist/Composer:"), span.key:contains("Band/Artist:")').next().text();
	}
}
