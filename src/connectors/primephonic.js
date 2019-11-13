'use strict';

Connector.playerSelector = '.player';

Connector.trackArtSelector = '#currently-playing-album-cover img';

Connector.artistSelector = '#currently-playing-composer';

Connector.trackSelector = '.currently-playing .movement';

Connector.albumSelector = '#currently-playing-work';

Connector.currentTimeSelector = '.progress span[title="Current Time"]';

/*
 * The website has toggleable remaining time/duration.
 * Either duration or remaining time is visible at the moment.
 * We keep both selectors and use a value of an active element.
 */

Connector.durationSelector = '.progress span[title="Total Time"]';

Connector.remainingTimeSelector = '.progress span[title="Remaining Time"]';

Connector.playButtonSelector = '#player-play-pause img[title="Play"]';
