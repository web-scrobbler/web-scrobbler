'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artistName`;

Connector.trackSelector = `${Connector.playerSelector} .songName`;

Connector.timeInfoSelector = '.rightWrapper';

Connector.isPlaying = () => $('.playerPlay').attr('src').includes('pause');
