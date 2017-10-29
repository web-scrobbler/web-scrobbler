'use strict';

/**
 * This script runs in the context of soundcloud itself.
 * It listens to the page event bus, and propagates these
 * events to the extension via 'postMessage'.
 */

window.SC_ATTACHED = window.SC_ATTACHED || false;

(function() {
	let eventBus;
	let playManager;
	let currentMetaData;

	// Exit if already attached.
	if (window.SC_ATTACHED) {
		return;
	}

	window.webpackJsonp([], {
		// eslint-disable-next-line object-shorthand
		0: function(e, t, _require) {
			let modules = _require.c;

			for (let moduleid in modules) {
				if (modules.hasOwnProperty(moduleid)) {
					let el = _require(moduleid);
					// console.group('moduleid: ' + moduleid);
					// console.dir(el);
					// console.groupEnd();

					// playManager used to get current playing song when song starts on page load
					if (typeof el.playCurrent === 'function') {
						playManager = el;
					} else if (el.trigger && el.bind && el.listenToOnce && el.broadcast) {
						eventBus = el;
					}
					if (playManager && eventBus) {
						return;
					}
				}
			}
		}
	});

	if (!eventBus) {
		console.log('Cannot scrobble, unable to find event bus. Please report at https://github.com/david-sabata/web-scrobbler/issues');
		return;
	}

	eventBus.on('audio:play', function(e) {
		window.postMessage({
			type: 'SC_PLAY',
			metadata: e.model.attributes
		}, '*');
	});
	eventBus.on('audio:pause', function(e) {
		window.postMessage({
			type: 'SC_PAUSE',
			metadata: e.model.attributes
		}, '*');
	});

	// if song starts playing when page is loaded the play event isn't detected
	// so send play event
	currentMetaData = playManager.getCurrentMetadata();
	if (currentMetaData) {
		window.postMessage({
			type: 'SC_PLAY',
			metadata: currentMetaData.sound._previousAttributes
		}, '*');
	}

	window.SC_ATTACHED = true;
}());
