import browser from 'webextension-polyfill';
import scrobbleService from '../object/scrobble-service';
import { sendContentMessage } from '@/util/communication';

export function webhookListenForApproval() {
	const scriptUrl = browser.runtime.getURL(
		'connectors/webhook-auth-dom-inject.js',
	);
	const script = document.createElement('script');
	script.src = scriptUrl;
	script.onload = function () {
		const e = this as HTMLScriptElement;
		e.parentNode?.removeChild(e);
	};
	(document.head || document.documentElement).appendChild(script);

	window.addEventListener('message', (e: MessageEvent<unknown>) => {
		if (
			typeof e.data === 'object' &&
			e.data &&
			'sender' in e.data &&
			e.data.sender === 'web-scrobbler' &&
			'type' in e.data &&
			e.data.type === 'confirmLogin' &&
			'applicationName' in e.data &&
			typeof e.data.applicationName === 'string' &&
			'userApiUrl' in e.data &&
			typeof e.data.userApiUrl === 'string'
		) {
			scrobbleService
				.getScrobblerByLabel('Webhook')
				?.addUserArrayProperties({
					applicationName: e.data.applicationName,
					userApiUrl: e.data.userApiUrl,
				})
				.then(() => {
					sendContentMessage({
						type: 'updateScrobblerProperties',
						payload: undefined,
					});
				});
		}
	});
}
