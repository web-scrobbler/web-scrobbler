export {};

const filter = MetadataFilter.createFilter({
	artist: [replaceSmartQuotes],
	track: [
		replaceSmartQuotes,
		MetadataFilter.removeVersion,
		MetadataFilter.removeCleanExplicit,
	],
});
// we are using fuzzy matching for the classes in this connector because I think they are generated at run time and thus can potentially change on each build. This would make the only consistent part the suffix of the class name, ex: "AudioPlayer_audioController".
Connector.playerSelector = '[class*="AudioPlayer_audioController"]';

Connector.getTrackInfo = () => {
	// Tracklist on this page are paginated. When the page is initially loaded this will click the button and it keep clicking "Show More" on each play cycle until all tracks are displayed and the "Show More" button is no longer present. This is necessary because as the tracks play there will be a possiblity that the currently playing track is not in the DOM and thus the connector won't be able to get the track info.
	const showMoreButton = document.querySelector<HTMLElement>(
		'[class*="EmbeddedTracklist_pagingShowMore"]',
	);
	if (showMoreButton) {
		showMoreButton.click();
		return null;
	}
	// .shows/... page(s), ex: https://www.kcrw.com/shows/francesca-harding/stories/a-playlist-of-high-energy-indie-delectable-disco-and-groovy-ethio-jazz
	// the tracklist shows the currently playing track with an SVG playing indicator inside its prefix element
	const playingItem = document.querySelector(
		'[class*="EmbeddedTracklist_tracklistItem"]:has([class*="Tracklist_prefix"] svg)',
	);

	Util.debugLog(`playingItem: ${playingItem}`);
	Util.debugLog(`playingItem innerHTML: ${playingItem?.innerHTML}`);

	if (!playingItem) {
		return null;
	}

	const trackEl = playingItem.querySelector(
		'[class*="Tracklist_trackTitle"]',
	);
	const artistEl = playingItem.querySelector('[class*="Tracklist_info"]');
	const trackText =
		(trackEl as HTMLElement | null)?.innerText?.trim() ?? null;
	const artistText =
		(artistEl as HTMLElement | null)?.innerText?.trim() ?? null;

	Util.debugLog(`trackText: ${trackText}`);
	Util.debugLog(`artistText: ${artistText}`);

	// There may need to be some sort of check here for BREAK if/when it is possible to suppport scrobbling from player.
	// ex. if (trackText === "BREAK" || artistText === "BREAK") {
	//     return null;
	// }
	if (!trackText) {
		return null;
	}

	return {
		artist: artistText,
		track: trackText,
	};
};

Connector.isPlaying = () => {
	const audio = document.querySelector<HTMLAudioElement>('audio');
	return audio ? !audio.paused : false;
};

Connector.applyFilter(filter);

function replaceSmartQuotes(text: string) {
	return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}
