'use strict';

Connector.artistSelector = '.artist-name>a';

Connector.trackSelector = '.song-name>a';

Connector.playerSelector = '.right-column';

Connector.trackArtSelector = '.cover-area img';

Connector.pauseButtonSelector = '#pauseBtn';

Connector.getTimeInfo = () => document.querySelector('#kkboxPlayer audio');

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
