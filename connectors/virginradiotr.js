/*
 *
 * Chrome-Last.fm-Scrobbler 
 * http://www.virginradioturkiye.com/live 
 * http://live.radioeksen.com/live
 * 
 *
 * 
 * Connector by Salim KAYABAŞI
 * http://www.salimkayabasi.com
 * to debug change its' status to 'true'
 */
 
var artist = '';
var track = '';
var isNewSong = true;
var playingSong = '#playingSong';
var debug = false;
 
 
$(function(){
		process();
	$(playingSong).bind('DOMSubtreeModified',function(e){
		process();
	});
	 // bind page unload function to discard current "now listening"
	$(window).unload(function() {      
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
	});
});

function process() 
{
	if(document.getElementById('playPauseButton').innerText != 'Başlat/Duraklat') 
	{
	if(debug)
	{
	console.log('not playing');
	}
		return;
	}
	else{
	if(debug)
	{
	console.log('playing now');
	}
	}
	if(parseTrack())
	{
		try{
				if(isNewSong)
				{
					chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
					if (response != false){
						chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: '245'});
						if(debug)
	{
						console.log('--scrobbling--')
						}
					}
					else
					{
					if(debug)
	{
						console.log(response);
						}
					}
					});
				}
			}
			catch(e){
			if(debug)
	{
			console.log(e);
			}
			} 
	}
};


function parseTrack()
{
	var song = document.getElementById('playingSong').innerText.trim();
	if(song == '')
	{
	if(debug)
	{
		console.log('NotFound: Song');
		}
		return false;
	}
	if(song.indexOf('Program / Tanıtım / Reklam') != -1)
	{
	if(debug)
	{
		console.log('advertisement will not send to Last.fm');
		}
		return false;
	}
	if(song.indexOf('Sonraki Şarkı') != -1) 
	{
		song = song.substring(0,song.indexOf('Sonraki Şarkı'));
	}
	separation = song.lastIndexOf(' - ');
	
	var TMPtrack = song.substring(0, separation).trim();
	var TMPartist = song.substring(separation+3).trim();
	if(artist != TMPartist && track != TMPtrack)
	{
		isNewSong = true;
		artist = TMPartist;
		track = TMPtrack;
		if(debug)
	{
		console.log('NEW SONG ' +track +' from '+artist);
		}
	}
	else
	{
		isNewSong = false;
		if(debug)
	{
		console.log('SAME SONG ' +track +' from '+artist);
		}
	}
	
	return true;
}