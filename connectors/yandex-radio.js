'use strict';

Connector.trackSelector = '.player-controls__title';

Connector.artistSelector = '.player-controls__artists';

Connector.trackArtSelector = '.slider__item_playing .track__cover';

Connector.isPlaying = () => $('body').hasClass('body_state_playing');

(function() {
	let actualObserver;
	let playerObserver = new MutationObserver(() => {
		let playerSelector = document.querySelector('.page-station');
		if (playerSelector !== null) {
			if (!actualObserver) {
				actualObserver = new MutationObserver(Connector.onStateChanged);
				actualObserver.observe(playerSelector, {
					subtree: true,
					childList: true,
					attributes: true,
					characterData: true
				});
			}
		} else if (actualObserver) {
			actualObserver.disconnect();
			actualObserver = null;
		}
	});

	playerObserver.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: false
	});
})();
