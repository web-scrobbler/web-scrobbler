export { };

Connector.playerSelector = '.site-player';

Connector.trackSelector = '.player__now-playing .title a';

Connector.artistSelector = '.player__now-playing .c-artists a';

Connector.albumSelector = '.player__now-playing .secondary-info a[href*="album"]';

Connector.trackArtSelector = '.player__now-playing .c-art img';

Connector.currentTimeSelector = '.player__current-time .current';

Connector.durationSelector = '.player__end-time';

Connector.isPlaying = () => {
    const icon = document.querySelector('.player__play-pause .material-symbols-outlined');
    return icon?.textContent?.trim() === 'pause';
};
