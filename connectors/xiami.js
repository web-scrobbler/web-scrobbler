'use strict';

Connector.playerSelector = '#player-main';

Connector.trackSelector = '#J_trackName';

Connector.albumSelector = '.ui-track-current .c3>a';

Connector.artistSelector = '#J_trackInfo>a:nth-child(2)';

Connector.playButtonSelector = '.play-btn';

Connector.currentTimeSelector = '#J_positionTime';

Connector.trackArtSelector = '#J_playerCoverImg';

Connector.durationSelector = '#J_durationTime';

Connector.getUniqueID = () => $('.ui-track-current .c1').data('id');
