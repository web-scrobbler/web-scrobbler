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

	let privacyUrl = chrome.runtime.getURL('PRIVACY.md');
	fetch(privacyUrl).then((response) => {
		response.text().then((text) => {
			let converter = new showdown.Converter();
			let content = converter.makeHtml(text);
			$('.privacy-policy').html(content);
		})
	});
});
