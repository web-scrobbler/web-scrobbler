'use strict';

Connector.playerSelector = '#html5player';

Connector.getTrack = () => $('#staticHeader h3').contents()[0].textContent;

Connector.artistSelector = '#staticHeader h4 > a';

Connector.currentTimeSelector = '#progress';

Connector.durationSelector = '#duration';

Connector.trackArtSelector = '#artwork img';

Connector.isPlaying = () => $('.playtoggle').hasClass('pause');
