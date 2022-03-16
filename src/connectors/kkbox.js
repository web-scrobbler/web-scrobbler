'use strict';

Connector.artistSelector = '._2kDaGE';

Connector.trackSelector = '._1VVryi>a';

Connector.playerSelector = '._2eEzN2';

Connector.trackArtSelector = '._3rswBX img';

Connector.pauseButtonSelector = '.k-icon-now_playing-pause';

Connector.getTimeInfo = () => Util.splitTimeInfo(document.querySelector('._3nysXh').innerText);

const filter = MetadataFilter.createFilter({
	track: getLocalName,
	artist: getLocalName,
});

Connector.applyFilter(filter);

function getLocalName(name) {
	// Sanity check - if parenthesis is not entirely non-ascii, or outside parenthesis is not entirely ascii, don't apply filter
	const localName = name.replace(/[ -~].*?\((.*?)\)/, '$1');
	return localName.match(/[!-~]/) ? name : localName;
}
