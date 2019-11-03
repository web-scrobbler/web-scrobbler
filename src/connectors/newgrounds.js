'use strict';

const artistSelector = '.ng-apg-media-artist';
const trackSelector = '.ng-apg-media-title';

Connector.playerSelector = ['#_ngHiddenAudioPlayer', '#audio-listen-player'];

Connector.playButtonSelector = ['#global-audio-player-play', '#audio-listen-play'];

Connector.pauseButtonSelector = ['#global-audio-player-pause', '#audio-listen-pause'];

Connector.trackArtSelector = '.ng-apg-media-icon';

Connector.currentTimeSelector = ['#global-audio-player-progress', 'audio-listen-progress'];

Connector.durationSelector = ['#global-audio-player-duration', 'audio-listen-duration'];

/*Connector.getArtistTrack = () => {
	let { artist, track } = Util.getTextFromSelectors(artistSelector);

}*/

Connector.artistSelector = ['.ng-apg-media-artist', '.smaller'];

Connector.trackSelector = ['.ng-apg-media-title', 'name'];
