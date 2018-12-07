'use strict';

Connector.playerSelector = '.recaster-mainWrapper';

Connector.artistSelector = '.recaster-currentArtist';

Connector.trackSelector = '.recaster-currentSong';

Connector.trackArtSelector = '.recaster-coverLink img';

Connector.isPlaying = () => $('.recaster-mainBt').hasClass('rc-active');
