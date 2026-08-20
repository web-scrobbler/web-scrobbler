export {};

const filter = MetadataFilter.createFilter(
	MetadataFilter.createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		trimSpaces,
	),
);

const filterRules = [
	{ source: /\t/g, target: ' ' },
	{ source: /\n/g, target: ' ' },
	{ source: /\s+/g, target: ' ' },
];

Connector.playerSelector = '.glass';

Connector.artistSelector = '.glass .text-xs';

Connector.getTrack = () => {
	const element = document.querySelector('.glass .font-semibold');
	if (!element) {
		return null;
	}
	let text = '';
	for (const node of element.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) {
			text += node.textContent;
		} else {
			break;
		}
	}
	return text;
};

// Pause icon (<rect> elements) visible = playing. The site has no
// <audio> element (playback via Web Audio API).
Connector.pauseButtonSelector = '.glass button.rounded-full:has(svg rect)';

Connector.applyFilter(filter);

function trimSpaces(text: string) {
	return MetadataFilter.filterWithFilterRules(text, filterRules);
}
