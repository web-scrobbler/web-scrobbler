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

	const loadPrivacy =  async () => {
		const locale = window.navigator.language.split('-')[0];
		const defaultPrivacyDoc = 'PRIVACY.md';

		let privacyDocs = [defaultPrivacyDoc];

		if (locale !== 'en') {
			let privacyDoc = `PRIVACY.${locale}.md`;
			privacyDocs.unshift(privacyDoc);
		}

		for (let privacyDoc of privacyDocs) {
			console.log(`fetching ${privacyDoc}`);
			try {
				const response = await fetch(chrome.runtime.getURL(privacyDoc));
				const markdown = await response.text();
				let converter = new showdown.Converter();
				let content = converter.makeHtml(markdown);
				$('.privacy-policy').html(content);
				break;
			} catch (err) {
				console.log(`Failed to load privacy ${err}`);
				continue;
			}
		}
	}

	loadPrivacy();
});
