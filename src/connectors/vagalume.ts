export {};

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

		Connector.isPlaying = () =>
			Boolean(document.querySelector('.controls .ion-pause'));

		Connector.getCurrentTime = () => {
			const text = Util.getAttrFromSelectors('.progress-bar', 'current');
			return Util.stringToSeconds(text);
		};

		Connector.getDuration = () => {
			const text = Util.getAttrFromSelectors('.progress-bar', 'duration');
			return Util.stringToSeconds(text);
		};
	}
	function setupVideoPlayer() {
		function isSingle() {
			/* lyric page */
			return Util.hasElementClass('html', 'page-letra');
		}
		function isListSongsFM() {
			return Boolean(document.querySelector('.listSongsFM'));
		}
		/* for discografia and switching player versions */
		Util.bindListeners(
			[
				'div.info',
				'#vPlayer',
				'#playerTop100',
				'#content.artist',
				'#playerContainer',
			],
			'DOMNodeInserted',
			Connector.onStateChanged,
		);

		/* new player, old player, listSongsFM */
		Connector.playerSelector =
			'.vPlayer3, .vPlayerStd, .playerFM, .listSongsFM';

		Connector.getTrack = () =>
			Util.getTextFromSelectors('.infoMusic h3') ||
			(isSingle() ? Util.getTextFromSelectors('#header h1') : null);

		Connector.getArtist = () =>
			Util.getTextFromSelectors('.infoMusic h5') ||
			(isSingle() ? Util.getTextFromSelectors('#header p a') : null);

		Connector.artistTrackSelector =
			'.playTracks li.playing span,\
			.songsList li.playing a';

		if (isListSongsFM()) {
			Connector.getArtistTrack = () => {
				const li = document.querySelector('.songList li:first-child');
				const texts = [
					...(li?.querySelectorAll('a') ?? []),
					...(li?.querySelectorAll('span') ?? []),
				];
				const text = texts.map((e) => e.innerText).join('');
				return Util.splitArtistTrack(text);
			};
		}

		Connector.albumSelector =
			'#album .left span,\
			.current ~ a span,\
			.playing .playlistAlbumInfo a';

		Connector.getTrackArt = () => {
			const parent = document.querySelector('.current')?.parentElement;
			return (
				Util.getAttrFromSelectors('#album img', 'src') ||
				parent?.querySelector('.cover img')?.getAttribute('src') ||
				Util.getAttrFromSelectors(
					'.playing .playlistAlbumInfo img',
					'src',
				)
			);
		};

		Connector.isPlaying = () => Boolean(document.querySelector('.pause'));

		Connector.currentTimeSelector = '.currentTime, .timer';

		Connector.durationSelector = '.duration';

		Connector.getUniqueID = () =>
			/* new player */
			Util.getDataFromSelectors(
				'li.itemPlaylist.playing',
				'pointerid',
			) /* playlist */ ||
			Util.getTextFromSelectors('#lyrFoot b a')
				?.split('=')
				.at(-1) /* single */ ||
			Util.getDataFromSelectors(
				'.songList li:first-child',
				'pointerid',
			); /* list songs FM */
	}
}
