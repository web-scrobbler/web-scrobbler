export {};

Connector.playButtonSelector = '.middle.paused';
Connector.playerSelector = '.inner-size';
Connector.trackSelector = '.current-track h3';
Connector.artistSelector = '.current-track h2';
Connector.currentTimeSelector = '.timer span:nth-child(1)';
Connector.durationSelector = '.timer span:nth-child(2)';

Connector.isScrobblingAllowed = () => Connector.getTrack() !== 'Loading...';
