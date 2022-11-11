'use strict';

const songOnNow = '.songLineOnNow';

Connector.playerSelector = '.playlistSongArea';

Connector.artistSelector = `${songOnNow} .songDetail .songArtist`;

Connector.trackSelector = `${songOnNow} .songDetail .songTitle`;

Connector.albumSelector = `${songOnNow} .songDetail .songAlbum`;

Connector.trackArtSelector = `${songOnNow} img.songCover`;

Connector.durationSelector = `${songOnNow} .songDuration`;

Connector.currentTimeSelector = `${songOnNow} .progressTime`;

Connector.isTrackArtDefault = (url) => url.includes('album-art-default');

Connector.isPlaying = () => Util.isElementVisible('.songPlaying .pauseButton');
