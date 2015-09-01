'use strict';

/* global Connector */

/**
 * To update the inject list, Open a RadioPlayer, view the A-Z list, and run the following command below
 * function onlyUnique(value, index, self) { return self.indexOf(value) === index; } var list = new Array(); $('.overlay-item-link').each(function(i, v){ var url = $(v).attr('href'); url = url.substring(7); url = url.substring(0, url.indexOf('/')); list.push('*://'+url+'/*'); }); list = list.filter(onlyUnique); console.log(JSON.stringify(list));
 * Thanks to Jiminald, Sharjeel Aziz, gerjomarty
 */

Connector.playerSelector = '.radioplayer-localwrapper';

Connector.artistTrackSelector = '.scrolling-text';

Connector.isPlaying = function () {
	return $('#stop').is(':visible');
};
