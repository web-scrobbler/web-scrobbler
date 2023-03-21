export {};

Connector.artistSelector = '.mainPanel .artist';

Connector.albumSelector = '.mainPanel .album';

Connector.trackSelector = '.mainPanel .song';

Connector.playButtonSelector = '#mp3_play .musicPlay';

Connector.currentTimeSelector = '#mp3_position';

Connector.durationSelector = '#mp3_duration';

Connector.trackArtSelector = '.mainPanel .artwork > img';

new MutationObserver(Connector.onStateChanged).observe(document, {
	childList: true,
	subtree: true,
	attributes: true,
	characterData: true,
});
