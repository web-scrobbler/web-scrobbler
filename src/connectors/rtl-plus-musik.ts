export {};

Connector.playerSelector = 'plus-player-container';

Connector.trackSelector = 'plus-player-container .album';

Connector.artistSelector = 'plus-player-container .artist';

Connector.currentTimeSelector = 'plus-player-container music-progress .current-time';

Connector.remainingTimeSelector = 'plus-player-container music-progress .duration';

Connector.isPlaying = () => {
    const titleElements = Util.queryElements('plus-player-container .play-icon > svg > title');
    if (titleElements && titleElements[0].textContent) {
        const isPaused = titleElements[0].textContent.indexOf('Abspielen') >= 0;
        return !isPaused;
    }
    return false;
};
