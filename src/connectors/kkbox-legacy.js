'use strict';

Connector.artistSelector = '.artist-name>a';

Connector.trackSelector = '.song-name>a';

Connector.playerSelector = '.right-column';

Connector.trackArtSelector = '.cover-area img';

Connector.pauseButtonSelector = '#pauseBtn';

Connector.getTimeInfo = () => document.querySelector('#kkboxPlayer audio');

const filter = MetadataFilter.createFilter({
	track: getLocalizedName,
	artist: getLocalizedName,
});

Connector.applyFilter(filter);

function getLocalizedName(name) {
	// Sanity check - if parenthesis is not entirely non-ascii, or outside parenthesis is not entirely ascii, don't apply filter
	const localizedName = name.replace(/[ -~].*?\((.*?)\)/, '$1');
	return localizedName.match(/[!-~]/) ? name : localizedName;
}
