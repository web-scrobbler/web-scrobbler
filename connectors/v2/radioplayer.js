'use strict';

/* global Connector */
Connector.playButtonSelector = 'button.play';
Connector.playerSelector = ".live-info";

Connector.getArtistTrack = function(){
	let t = "";
	
	if($(".song-text").html()){
		t = $(".song-text").html()
	}
	else if($(".scrolling-text")){
		t = $(".scrolling-text").html()
	}
	
	//console.log("Current Track:", Util.splitArtistTrack(t))
	return Util.splitArtistTrack(t);
}
