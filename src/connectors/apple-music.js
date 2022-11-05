'use strict';

const shadowRoot = document.querySelector('amp-lcd').shadowRoot;

const queryShadowRoot = (selector) => shadowRoot.querySelector(selector);

Connector.getArtist = () => queryShadowRoot('.lcd-meta__secondary .lcd-meta-line__fragment:first-child').textContent;

Connector.getAlbum = () => queryShadowRoot('.lcd-meta__secondary .lcd-meta-line__fragment:last-child').textContent;

Connector.getCurrentTime = () => queryShadowRoot('.lcd-progress__time--elapsed').textContent;

Connector.getRemainingTime = () => queryShadowRoot('.lcd-progress__time--remaining').textContent;

Connector.getTrack = () => queryShadowRoot('.lcd-meta__primary-wrapper .lcd-meta-line__fragment').textContent;

Connector.pauseButtonSelector = '.playback-play__pause';

// Manually update as the player is within shadow root
const observer = new MutationObserver(Connector.onStateChanged);
observer.observe(shadowRoot, {
	childList: true,
	subtree: true,
	attributes: true,
	characterData: true,
});
