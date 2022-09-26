'use strict';

Connector.playerSelector = '.the_wrapper';

Connector.getTrackInfo = () => {
	const trackElement = document.querySelector('#headerLiveHolderNow .now-playing-bar .current');

	if (trackElement) {
		return {
			artist: 'Totally Wired Radio', // individual artist info not provided
			track: trackElement.childNodes[2].textContent, // name of show
		};
	}

	return null;
};

Connector.trackArtSelector = '#CurrentShowImage img'; // only available in popup player

Connector.currentTimeSelector = '#time-elapsed';

Connector.remainingTimeSelector = '#time-remaining';

Connector.isPlaying = () => Util.hasElementClass('a.AudioPlay', 'AudioPause');

Connector.isPodcast = () => true;

const filter = MetadataFilter.createFilter({
	track: (text) => text.replace(' #live', ''), // remove #live hash appended to some shows
});

Connector.applyFilter(filter);
