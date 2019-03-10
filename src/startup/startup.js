'use strict';

require([
	'wrapper/chrome',
	'storage/chrome-storage',
	'vendor/showdown.min'
], function(chrome, ChromeStorage, showdown) {
	$('#opt-in').click(() => {
		update(false);
	});

	$('#opt-out').click(() => {
		update(true);
	});

	let update = (value) => {
		const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

		options.get().then((data) => {
			data.disableGa = value;
			options.set(data);
		});

		window.close();
		$('.controls').hide();
		$('.finished').show();
	};

	const locale = window.navigator.language.split('-')[0];
	const defaultPrivacyDoc = 'PRIVACY.md';

	let privacyDoc = defaultPrivacyDoc;
	if (locale !== 'en') {
		privacyDoc = `PRIVACY.${locale}.md`;
	}

	fetch(chrome.runtime.getURL(privacyDoc))
		.then((response) => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			response.text()
				.then((text) => {
					let converter = new showdown.Converter();
					let content = converter.makeHtml(text);
					$('.privacy-policy').html(content);
				});
		}).catch(() => {
			console.log(`Failed to load ${privacyDoc}`);

			fetch(chrome.runtime.getURL(defaultPrivacyDoc))
			.then((response) => {
				response.text()
				.then((text) => {
					let converter = new showdown.Converter();
					let content = converter.makeHtml(text);
					$('.privacy-policy').html(content);
				});
			})
		});
});
