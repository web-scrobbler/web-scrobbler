'use strict';

/* global Connector */

Connector.playerSelector = '.livestream';
Connector.artistSelector = 'p.artist';
Connector.trackSelector = 'p.songtitle';

Connector.isPlaying = function () {
	var result = false;
	var state = retrieveJwplayerState();
	if (typeof state === 'string') {
		result = (state.toUpperCase() === 'PLAYING');
	}
	return result;
};

function retrieveJwplayerState() {
	var scriptContent = "if (typeof jwplayer !== 'undefined') $('body').attr('tmp_state', jwplayer().getState());\n"

	var script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(script);

	var ret = $("body").attr("tmp_state");

	$("body").removeAttr("tmp_state");
	$("#tmpScript").remove();

	return ret;
}
