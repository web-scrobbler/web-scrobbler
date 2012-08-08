// TODO: 
// - autocorrection,
// - detect titles of the form '<artist> - <title>' and do some kind of
//   smart correction by comparing artist and soundcloud username
//
$(function() {	
	// The div.player enclosing the current song.
	var current, validated = false; 
	
	
	var trackids = {};

	var validate = function(song) {
		chrome.extension.sendRequest(
			{type: 'validate', artist: song.artist, track: song.track},
			function(response) {
				validated = response;
				console.log(current, validated);
				if (!current || validated)
					return;
					
				if ($(current).hasClass('set')) {
					$('li.playing', current).append('<li>(not recognized)</li>');
				}
				else {
					var stats;
					if (stats = $('span.stats', current)) {
						//var notfound = $('<span>not found</span>');
						stats.prepend('<span>not found</span>');
						$('span.first').removeClass('first');
						$('span:first-child').addClass('first')
					}
				}
			});
	};

	var track = function(context) {
		if ($(context).hasClass('set'))
			return $('li.playing .info a', context).text();
		else
			return $('.info-header h3 a, .info-header h1 em', context).text();
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
	var check = function(context) {
		// Expect only one element to match 'a.playing'

		var parent;
		parent = $(context).closest('li.set').get(0) ||
                 $(context).closest('div.player').get(0);
		if (!parent)
			console.log('couldnt get player from', context);
		return (current = parent);
	};

	// Prevent multiple update firings.
	var lock = false;
	var update = function(song) {
		if (lock)
			return;
		lock = true;
		if (validated) {
			chrome.extension.sendRequest(
				{type: 'nowPlaying', artist: validated.artist,
				 track: validated.track, duration: validated.total});
		}
		else {
			chrome.extension.sendRequest({type: 'nowPlaying', 
										  duration: song.duration});
		}
		setTimeout(function() { lock = false; }, 1000);
	};

	var timespan;
	$('.timecodes .editable').live('DOMSubtreeModified', function() {
		var text = $(this).text(), player;
		if (text == '0.01' && timespan != this) {
			timespan = this;
			player = check(timespan);
			if (player)
				validate(song(player));
		}
		else if (validated && timespan == this) {
			var length = $(this).siblings('span.duration').text();
			var curr = parseFloat(text), full = parseFloat(length);
			if (curr && full && (curr / full) >= .4) {
				update(current);
				timespan = current = null;
				validated = false;
			}
		}
	});

	// Alternative to using DOMSubtreeModified; just use setInterval:
	//setInterval(checkPlaying, 1000);

	$(window).unload(function() {
		chrome.extension.sendRequest({type: 'reset'});
		return true;   
	});
});
