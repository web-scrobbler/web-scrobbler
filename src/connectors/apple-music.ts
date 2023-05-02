export {};

const shadowRoot = document.querySelector('amp-lcd')?.shadowRoot;

const queryShadowRoot = (selector: string) =>
	shadowRoot?.querySelector(selector);

Connector.getArtist = () =>
	queryShadowRoot('.lcd-meta__secondary .lcd-meta-line__fragment:first-child')
		?.textContent;

Connector.getAlbum = () =>
	queryShadowRoot('.lcd-meta__secondary .lcd-meta-line__fragment:last-child')
		?.textContent;

Connector.getCurrentTime = () =>
	parseInt(
		queryShadowRoot('.lcd-progress__time--elapsed')?.textContent ?? '0'
	);

Connector.getRemainingTime = () =>
	parseInt(
		queryShadowRoot('.lcd-progress__time--remaining')?.textContent ?? '0'
	);

Connector.getTrack = () =>
	queryShadowRoot('.lcd-meta__primary-wrapper .lcd-meta-line__fragment')
		?.textContent;

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.playback-play__pause', 'aria-hidden') !==
	'true';

// Manually update as the player is within shadow root
const observer = new MutationObserver(Connector.onStateChanged);
if (shadowRoot) {
	observer.observe(shadowRoot, {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	});
}

// Update on buttons changing, these are outside shadow root
Connector.playerSelector = 'amp-playback-controls-play';
