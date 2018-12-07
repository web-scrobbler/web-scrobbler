'use strict';

Connector.playerSelector = 'div#root>div#player';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#title';

Connector.trackArtSelector = 'div#cover>img';

Connector.isPlaying = () => $('#playtoggle').hasClass('stop');
