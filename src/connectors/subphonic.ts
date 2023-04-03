'use strict';

Connector.playerSelector = '#playdeck';

Connector.getArtist = () => {
	return (
		Util.getTextFromSelectors('#songdetails_artist')?.split(' - ')[0] ??
		null
	);
};

Connector.trackSelector = '#songdetails_song';

Connector.isPlaying = () =>
	!(document.querySelector('#playdeck audio') as HTMLAudioElement).paused;

Connector.getAlbum = () => {
	return (
		Util.getTextFromSelectors('#songdetails_artist')?.split(' - ')[1] ??
		null
	);
};

Connector.trackArtSelector = '#coverartimage img';

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';
