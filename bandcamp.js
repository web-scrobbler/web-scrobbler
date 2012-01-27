/*
 * Chrome-Last.fm-Scrobbler BandCamp.com Connector by George Pollard
 *                (loosely based on Yasin Okumus's MySpace connector)
 * v0.1
 */
 var lastTrack = null;
 
$(function(){
	// bind page unload function to discard current "now listening"
	cancel();
});

var durationPart = ".track_info .time";
var durationRegex = /[ \n]*(\d+):(\d+)[ \n]*\/[ \n]*(\d+):(\d+)[ \n]*/;
function parseDuration(match){
	try{
		var m = durationRegex.exec(match);
		return {current: parseInt(m[1],10)*60 + parseInt(m[2],10), total: parseInt(m[3],10)*60 + parseInt(m[4],10)};
	}catch(err){
		return 0;
	}
}

function parseArtist()
{
	var byLine = "";
	if (isAlbum())
	{
		byLine = $("dt.hiddenAccess:contains('band name') ~ dd").text();
	}
	else // isTrack
	{
		byLine = $(".albumTitle nobr").text();
	}
	
	var artist = $.trim($.trim(byLine).substring(2));
	if(!artist) {
		artist = $('span[itemprop=byArtist]').text();
	}
	
	return artist;
}


function parseTitle()
{
	if (isAlbum())
	{
		return $(".track_info .title").text();
	}
	else //isTrack
	{
		return $(".trackTitle").first().text();
	}
}

function isAlbum()
{
	return document.location.toString().indexOf('bandcamp.com/album/') >= 0;
}

function cancel(){
	$(window).unload(function() {      
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
	});
}

console.log('BandCampScrobbler: loaded');

$(durationPart).bind('DOMSubtreeModified',function(e){
	var duration = parseDuration($(durationPart).text());
	
	//console.log('duration - ' + duration.current + ' / ' + duration.total);

	if(duration.current > 0) { // it's playing

		var artist = parseArtist();
		var track = parseTitle();

		var dashIndex = track.indexOf('-');
		if (artist == 'Various Artists' && dashIndex >= 0)
		{
			artist = track.substring(0, dashIndex);
			track = track.substring(dashIndex + 1);
		}

		artist = $.trim(artist);
		track = $.trim(track);

		if (lastTrack != track)
		{
			lastTrack = track;

			//console.log("BandCampScrobbler: scrobbling '" + track + "' by " + artist);
			chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
					chrome.extension.sendRequest({type: 'nowPlaying', artist: response.artist, track: response.track, duration: duration.total});
				}
				else
				{
					chrome.extension.sendRequest({type: 'nowPlaying', duration: duration.total});	
				}
			});
		}
	}
});
