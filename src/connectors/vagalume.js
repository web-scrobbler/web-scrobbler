/* eslint-disable no-undef */

'use strict';

setupConnector();

function setupConnector() {
	if (isRadio()) {
		setupRadioPlayer();
	}
	if (isVideo()) {
		setupVideoPlayer();
	}
	function isRadio() {
		return location.hostname.endsWith('.fm');
	}
	function isVideo() {
		return location.hostname.endsWith('.com.br');
	}
	function setupRadioPlayer() {
		Connector.playerSelector = '.station';

		Connector.trackSelector = '.info .track p';

		Connector.artistSelector = '.info .track span';

		Connector.isPlaying = () => 0 < $('.controls .ion-pause').length;

		Connector.getCurrentTime = () => {
			const text = $('.progress-bar').attr('current');
			return Util.stringToSeconds(text);
		};

		Connector.getDuration = () => {
			const text = $('.progress-bar').attr('duration');
			return Util.stringToSeconds(text);
		};
	}
	function setupVideoPlayer() {
		function isSingle() { /* lyric page */
			return Util.hasElementClass('html', 'page-letra');
		}
		function isListSongsFM() {
			return 0 < $('.listSongsFM').length;
		}
		/* for discografia and switching player versions */
		$('div.info, #vPlayer, #playerTop100, #content.artist, #playerContainer')
			.bind('DOMNodeInserted', Connector.onStateChanged);

		/* new player, old player, listSongsFM */
		Connector.playerSelector = '.vPlayer3, .vPlayerStd, .playerFM, .listSongsFM';

		Connector.getTrack = () => $('.infoMusic h3').text() ||
			(isSingle() ? $('#header h1').text() : null);

		Connector.getArtist = () => $('.infoMusic h5').text() ||
			(isSingle() ? $('#header p a').text() : null);

		Connector.artistTrackSelector = '.playTracks li.playing span,\
			.songsList li.playing a';

		if (isListSongsFM()) {
			Connector.getArtistTrack = () => {
				const text = $('.songList li:first-child').find('a, span').text();
				return Util.splitArtistTrack(text);
			};
		}

		Connector.albumSelector = '#album .left span,\
			.current ~ a span,\
			.playing .playlistAlbumInfo a';

		Connector.getTrackArt = () => {
			return $('#album img').attr('src') ||
				$('.current').parent().find('.cover img').attr('src') ||
				$('.playing .playlistAlbumInfo img').attr('src');
		};

		Connector.isPlaying = () => 0 < $('.pause').length;

		Connector.currentTimeSelector = '.currentTime, .timer';

		Connector.durationSelector = '.duration';

		Connector.getUniqueID = () => /* new player */
			$('li.itemPlaylist.playing').data('pointerid') ||	/* playlist */
				$('#lyrFoot b a').text().split('=').pop() ||	/* single */
				$('.songList li:first-child').data('pointerid');	/* list songs FM */
	}
}
