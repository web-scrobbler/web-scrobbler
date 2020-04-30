'use strict';

Connector.playerSelector = '.container';

Connector.artistSelector = '.list-body > div:nth-child(1) > div:nth-child(2) > p';

Connector.trackSelector = '.list-body > div:nth-child(1) > div:nth-child(3) > p';

Connector.pauseButtonSelector = '.player .fa-stop';

Connector.onReady = Connector.onStateChanged;
