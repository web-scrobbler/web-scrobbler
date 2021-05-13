'use strict';

Connector.artistSelector = '._2kDaGE';

Connector.trackSelector = '._1VVryi>a';

Connector.playerSelector = '._2eEzN2';

Connector.trackArtSelector = '._3rswBX img';

Connector.pauseButtonSelector = '.k-icon-ctrl-pause';

Connector.getTimeInfo = () => Util.splitTimeInfo(document.querySelector('._3nysXh').innerText);

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
