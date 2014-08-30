'use strict';

$(function() {
	$('a.help').click(function() {
		var url = chrome.extension.getURL('/dialogs/help/no_music_recognized.html');
		window.open(url, 'help', 'width=400,height=300');
	});
});
