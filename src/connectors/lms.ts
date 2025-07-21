export {};

Connector.playerSelector = '.container > .d-flex.align-items-center';

Connector.trackSelector = '.flex-fill.text-center .d-block.text-truncate';

Connector.artistSelector = '.flex-fill.text-center a[href^="/artist/"] span';

Connector.albumSelector = '.flex-fill.text-center a[href^="/release/"] span';

Connector.currentTimeSelector = '#lms-mp-curtime';

Connector.durationSelector = '#lms-mp-duration';

Connector.isPlaying = () =>
	document.querySelector('#lms-mp-playpause .fa.fa-fw.fa-play') === null;
