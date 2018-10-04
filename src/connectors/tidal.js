'use strict';

Connector.playerSelector = '[class^="nowPlaying"]';

Connector.playButtonSelector = `${Connector.playerSelector} [class^="playbackToggle"]`;

Connector.isScrobblingAllowed = () => !!$(Connector.playButtonSelector);

Connector.isPlaying = () => $(Connector.playButtonSelector).attr('data-test-id') === 'pause';

Connector.trackSelector = `${Connector.playerSelector} [class^="mediaInformation"] span:eq(0)`;

Connector.artistSelector = `${Connector.playerSelector} [class^="mediaArtists"]`;

Connector.trackArtSelector = `${Connector.playerSelector} [class^="mediaImageryTrack"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} [data-test-id="duration"] [class^="currentTime"]`;

Connector.durationSelector = `${Connector.playerSelector} [data-test-id="duration"] [class^="duration"]`;
