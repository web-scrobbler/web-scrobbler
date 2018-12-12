'use strict';

require([
	'config',
	'wrapper/chrome',
	'vendor/showdown.min'
], function(config, chrome, showdown, ) {


	$('#opt-in').click(function() {
		window.close();
	});

	$('#opt-out').click(function() {
		window.close();
	});

	let errorHandler = function(ex) {
		console.log(ex.message);
	}

	chrome.runtime.getPackageDirectoryEntry(function(root) {
		root.getFile('PRIVACY.md', {}, function(fileEntry) {
		  fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {

				let converter = new showdown.Converter();
				let content = converter.makeHtml(this.result);
				$('.privacy-policy').html(content);
			};
			reader.readAsText(file);
		  }, errorHandler);
		}, errorHandler);
	  });

});
