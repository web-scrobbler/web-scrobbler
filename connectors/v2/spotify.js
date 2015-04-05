

Connector.getArtist = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-artist');
	return (el === null) ? null : el.textContent.trim();
};

Connector.getTrack = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-name');
	return (el === null) ? null : el.textContent.trim();
};

Connector.getDuration = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-length');
	if (el === null) {
		return null;
	}

	return Connector.stringToSeconds(el.textContent.trim());
};

Connector.getCurrentTime = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-current');
	if (el === null) {
		return null;
	}

	return Connector.stringToSeconds(el.textContent.trim());
};

Connector.isPlaying = function() {
	var btn = $('#app-player').get(0).contentDocument.getElementById('play-pause');
	if (btn === null) {
		return false;
	}

	return btn.classList.contains('playing');
};

var onPlayerLoaded = function() {
	var observer = new MutationObserver(Connector.onStateChanged);
	var observeTarget = $('#app-player').get(0).contentDocument.getElementById('wrap');
	var config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
};

// wait for player to load
$('#app-player').on('load', onPlayerLoaded);
