'use strict';

Connector.playerSelector = '[class*=_PlayerUI__container_]';

Connector.artistSelector = '[class*=_CreativesLabel__container_]';

Connector.trackSelector = ['[class*=_ScrollingLabel__label_]', '[class*=_TrackInfo__mobileContainer_] > [aria-label^=track]'];

Connector.currentTimeSelector = '[class*=_PlayerBar__elapsedTime_]';

Connector.durationSelector = '[class*=_PlayerBar__waveform_] + span';

Connector.pauseButtonSelector = '[class*=_PlaybackControls__playPauseButton_][title=Pause]';
