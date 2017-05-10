'use strict';

/* global Connector */

Connector.playerSelector = '.livestream';
Connector.artistSelector = 'p.artist';
Connector.trackSelector = 'p.songtitle';

Connector.isPlaying = function () {
	var state = retrieveJwplayerState();
	return (typeof state === 'string') && (state.toUpperCase() === 'PLAYING');
};

function retrieveJwplayerState() {
	var scriptContent = 'if (typeof jwplayer === "function") $("body").attr("tmp_state", typeof jwplayer().getState === "function" ? jwplayer().getState() : "");\n';

	var script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(script);

	var ret = $('body').attr('tmp_state');

	$('body').removeAttr('tmp_state');
	$('#tmpScript').remove();

	return ret;
}
