export {};

Connector.playerSelector = '.player';

Connector.trackArtSelector = '.player-section .cover .loaded';

Connector.artistSelector = '.composer';

Connector.trackSelector = '.track-title';

Connector.albumSelector = '.work';

Connector.currentTimeSelector = '.progress span[title="Current Time"]';

/*
 * The website has toggleable remaining time/duration.
 * Either duration or remaining time is visible at the moment.
 * We keep both selectors and use a value of an active element.
 */

Connector.durationSelector = '.progress span[title="Total Time"]';

Connector.remainingTimeSelector = '.progress span[title="Remaining Time"]';

Connector.playButtonSelector = '.play-pause img[title=Play]';
