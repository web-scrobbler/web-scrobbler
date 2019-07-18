'use strict';

Connector.playerSelector = '[class^="nowPlaying"]';

Connector.playButtonSelector = `${Connector.playerSelector} [class*="playbackToggle"]`;

Connector.isScrobblingAllowed = () => !!$(Connector.playButtonSelector);

Connector.isPlaying = () => $(Connector.playButtonSelector).attr('data-test') === 'pause';

Connector.trackSelector = `${Connector.playerSelector} [class^="mediaInformation"] span:eq(0)`;

Connector.artistSelector = `${Connector.playerSelector} [class^="mediaArtists"]`;

Connector.albumSelector = `${Connector.playerSelector} [class^="infoTable--"] a[href^="/album/"]`;

Connector.trackArtSelector = `${Connector.playerSelector} [class^="mediaImageryTrack"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} [data-test="duration"] [class^="currentTime"]`;

Connector.durationSelector = `${Connector.playerSelector} [data-test="duration"] [class^="duration"]`;
