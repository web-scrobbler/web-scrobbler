'use strict';

Connector.playerSelector = '[class*=audioPlayer__liveStream-]';

Connector.artistSelector = `${Connector.playerSelector} [class^=audioPlayerTitle__artist-]`;

Connector.trackSelector = `${Connector.playerSelector} [class^=liveStreamTitle__heading-]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} [class^=playPauseButton__icon-][class*=playPauseButton__pause-]`;

Connector.isStateChangeAllowed = () => Connector.getTrack();
