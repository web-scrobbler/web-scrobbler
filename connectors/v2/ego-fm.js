'use strict';

/* global Connector */
Connector.playerSelector = '#playerInfo';

Connector.artistSelector = '#current > span.artist'
Connector.trackSelector = '#current > span.song'

Connector.isPlaying = function () {
	var spanelement = document.querySelector(".now")
	if(spanelement != null)
	{
	 	if( spanelement.innerHTML == "Jetzt:")
			return true;
	}
	else
		return false;
}
