export {};

Connector.artistSelector = '.yKVKxJ';

Connector.trackSelector = '.hayDaa>a';

Connector.playerSelector = '.mngLWd';

Connector.trackArtSelector = '.kl3pDr img';

Connector.pauseButtonSelector = '.k-icon-now_playing-pause';

Connector.getTimeInfo = () =>
	Util.splitTimeInfo(
		(document.querySelector('.bR5Q8S') as HTMLElement).innerText,
	);

const filter = MetadataFilter.createFilter({
	track: getLocalName,
	artist: getLocalName,
});

Connector.applyFilter(filter);

function getLocalName(name: string) {
	// Sanity check - if parenthesis is not entirely non-ascii, or outside parenthesis is not entirely ascii, don't apply filter
	const localName = name.replace(/[ -~].*?\((.*?)\)/, '$1');
	return localName.match(/[!-~]/) ? name : localName;
}
