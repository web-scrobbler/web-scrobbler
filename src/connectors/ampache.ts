export { };

Connector.playerSelector = '#webplayer';

Connector.artistSelector = '#webplayer > div.playing_info > div.playing_artist > a';

Connector.trackSelector = '#webplayer > div.playing_info > div.playing_title > a';

// Album is not displayed in this version of Ampache
// Connector.albumSelector = '';

Connector.trackArtSelector = '#jp_poster_0';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.isPlaying = () => {
    const pauseButton = document.querySelector('.jp-pause') as HTMLElement;
    if (!pauseButton) {
        return false;
    }
    const style = window.getComputedStyle(pauseButton);
    return style.display !== 'none';
};
