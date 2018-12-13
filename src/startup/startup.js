'use strict';

require([
	'config',
	'wrapper/chrome',
	'storage/chrome-storage',
	'vendor/showdown.min'
], function(config, chrome, ChromeStorage, showdown) {
	$('#opt-in').click(function() {
		update(false);
	});

	$('#opt-out').click(function() {
		update(true);
	});

	let errorHandler = function(ex) {
		console.log(ex.message);
	}

	function update(value) {
		const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS)

		options.get().then((data) => {
			data.disableGa = value
			options.set(data)
		});

		window.close();
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
