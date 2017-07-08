'use strict';

/* global Connector */
/* global MetadataFilter */

if (window.frames.length === 0) {
	// We are in YouTube frame
	// Overriding artist and track getters because the website contains
	// better metadata

	let artist = null;
	let track = null;

	Connector.getArtist = () => artist;
	Connector.getTrack = () => track;
	Connector.getArtistTrack = () => {};

	$('video').on('timeupdate', () => {
		window.parent.postMessage({ sender: 'ws-getArtistTrack' }, '*');
	});

	window.addEventListener('message', (event) => {
		if (event.data.sender !== 'ws-artistTrack') {
			return;
		}
		artist = event.data.artist;
		track = event.data.track;
	});

	Connector.filter = new MetadataFilter({
		artist: text => text.replace(/\s*original artist:/i, ''),
		track: text => text.replace(/^nightcore - /i, ''),
	});
} else {
	// We are in the top-level frame
	// Send data with artist and track to the YouTube frame

	Connector.artistSelector = 'tbody > tr > td > div > h3';
	Connector.trackSelector = 'tbody > tr > td > h1';

	window.addEventListener('message', (event) => {
		if (event.data.sender !== 'ws-getArtistTrack') {
			return;
		}
		event.source.postMessage({
			sender: 'ws-artistTrack',
			artist: Connector.getArtist(),
			track: Connector.getTrack(),
		}, '*');
	});
}
