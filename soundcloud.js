// TODO: 
// - autocorrection,
// - detect titles of the form '<artist> - <title>' and do some kind of
//   smart correction by comparing artist and soundcloud username
//
$(function() {	
	// The div.player enclosing the current song.
	var current; 

	var track = function(context) {
		return ($(context).hasClass('set') && 
		        $('li.playing .info a', context).get(0).text) ||
		       $('.info-header h3 a', context).get(0).text;
	};
	var artist = function(context) {
		return $('.info-header a.user-name', context).get(0).text;
	};
	var duration = function(context) {
		var span = $('span.duration', context).get(0);
		return parseInt($(span).attr('title').substring(2), 10);
	};

	var song = function(context) {
		return {
			'track': track(context),
			'artist': artist(context),
			'duration': duration(context)
		};	
	};

	// Track current song by watching which 'a.play' elements get the
	// 'playing' class added to them. Then the closest div.player enclosing
	// this tag will contain elements that describe the current song.
	var lastElement; 
	var checkPlaying = function(element) {
		// Expect only one element to match 'a.playing'
		if (!element)
			element = $('a.playing').get(0);

		if (!element || (lastElement && element == lastElement))
			return;

		lastElement = element;
		current = $(element).closest('li.set').get(0) || $(element).closest('div.player').get(0);
		if (current)
		    update(song(current));
	};

	// Prevent multiple update firings.
	var lock = false;
	var update = function(song) {
		if (lock)
			return;
		lock = true;
		chrome.extension.sendRequest(
			{type: 'validate', artist: song.artist, track: song.track},
			function(response) {
				if (response) {
					chrome.extension.sendRequest(
						{type: 'nowPlaying', artist: response.artist,
						 track: response.track, duration: duration.total});
				}
				else {
					chrome.extension.sendRequest({type: 'nowPlaying', 
												  duration: duration.total});
				}
				lock = false;
			});
	};

	var timespan;
	$('.timecodes .editable').live('DOMSubtreeModified', function() {
		if (timespan == this)
			return;
		var text = $(this).text();
		if (text === '0.01')
			checkPlaying(timespan = this);
	});

	// Alternative to using DOMSubtreeModified; just use setInterval:
	//setInterval(checkPlaying, 1000);

	$(window).unload(function() {
		chrome.extension.sendRequest({type: 'reset'});
		return true;   
	});
});
