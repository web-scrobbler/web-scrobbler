'use strict';

Connector.playerSelector = '#opbanner';

Connector.artistSelector = '#singer_name a';

Connector.trackSelector = '#song_name a';

Connector.getUniqueID = () => {
	let text = $('#song_name a').attr('href');
	return text.split('/').pop().split('.html').shift();
};

Connector.albumSelector = '#album_name a';

Connector.isPlaying = () => $('#btnplay').hasClass('btn_big_play--pause');

Connector.timeInfoSelector = '#time_show';

Connector.trackArtSelector = '#song_pic';
