'use strict';

Connector.playerSelector = '#opbanner';

Connector.getArtist = () => $('#sim_song_info .js_singer').attr('title');

Connector.getTrack = () => $('#sim_song_info .js_song').attr('title');

Connector.isPlaying = () => $('#btnplay').hasClass('btn_big_play--pause');

Connector.timeInfoSelector = '#time_show';

Connector.trackArtSelector = '#song_pic';
