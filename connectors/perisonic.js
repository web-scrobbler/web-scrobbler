'use strict';

Connector.artistSelector = '#title h3';

Connector.trackSelector = '#title p';

Connector.trackArtSelector = '#coverart img';

Connector.isPlaying = () => $('#playpause').hasClass('pause');

$('#title').bind('DOMSubtreeModified', Connector.onStateChanged);
