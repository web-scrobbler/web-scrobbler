'use strict';

Connector.playerSelector = 'player';
Connector.artistSelector = 'cover-with-info.current.cover artist-names div.value';
Connector.trackSelector = 'cover-with-info.current.cover div.title-content > span.title';
Connector.albumSelector = 'cover-with-info.current.cover div.album';
Connector.currentTimeSelector = 'time-progress div.time.duration';
Connector.durationSelector = 'time-progress div.track.duration';
Connector.isPlaying = () => $('time-progress div.time.duration').hasClass('ng-star-inserted');
