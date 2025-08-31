/*
 * This connector covers archived tracks only. A `radiorethink` connector
 * is used to get track info from WFMU main streams.
 */

export {};

Connector.playerSelector = '.player-section';

Connector.artistSelector = '.playing > .segment-artist';

Connector.trackSelector = '.playing > .segment-title';

Connector.playButtonSelector = '#play-buttton';
