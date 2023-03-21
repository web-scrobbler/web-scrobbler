export {};

const OBSERVER_THROTTLE_INTERVAL = 1000;

const filter = MetadataFilter.createFilter({ artist: removeByPrefix });
const trackInfoSelector = '._2Os_QRvaRk-4LyqyE4fhsh';
const trackInfoBtnSelector = 'footer button';

Connector.onReady = setupObserver;

Connector.playerSelector = '#root';

Connector.artistSelector = `${trackInfoSelector} > div:nth-child(2)`;

Connector.trackSelector = `${trackInfoSelector} > div:nth-child(1)`;

Connector.isPlaying = () => {
	return !Util.hasElementClass('[data-test-id="playButton"]', 'undefined');
};

Connector.isStateChangeAllowed = () => {
	/*
	 * Sometimes track info is hidden for a while. To prevent
	 * resetting the current state, don't allow to update state
	 * if no track info is on the page.
	 */
	return Boolean(Connector.getArtist() && Connector.getTrack());
};

Connector.applyFilter(filter);

function removeByPrefix(text: string) {
	return text.replace('By: ', '');
}

function setupObserver() {
	/*
	 * Focus@Will website does not display track info all the time, but does it
	 * for a short time by clicking on "Track Info" button. To keep displaying
	 * track info all the time, the connector clicks on "Track Info" button
	 * periodically.
	 */
	new MutationObserver(
		Util.throttle(() => {
			// Click on "Track Info" button to display track info.
			const trackInfoButton = document.querySelector(
				trackInfoBtnSelector
			) as HTMLButtonElement;
			const isButtonActive =
				Util.getCSSPropertyFromSelectors(
					trackInfoBtnSelector,
					'opacity'
				) === '1';
			if (isButtonActive) {
				trackInfoButton.click();
			}
		}, OBSERVER_THROTTLE_INTERVAL)
	).observe(document, {
		subtree: true,
		childList: true,
		attributes: true,
		characterData: true,
	});
}
