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

	(async() => {
		const locale = chrome.i18n.getMessage('@@ui_locale');
		const defaultPrivacyDoc = 'PRIVACY.md';
		let privacyDocs = [defaultPrivacyDoc];

		if (!locale.startsWith('en')) {
			let localeSplit = locale.split('_');
			privacyDocs.unshift(`PRIVACY.${localeSplit[0]}.md`);
			privacyDocs.unshift(`PRIVACY.${locale}.md`);
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
				console.log(`Failed to load ${privacyDoc}, reason: ${err.message}`);
			}
		}
	})();
});
