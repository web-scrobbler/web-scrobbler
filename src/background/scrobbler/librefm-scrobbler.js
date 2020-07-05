import AudioScrobbler from '@/background/scrobbler/audio-scrobbler';
import { createQueryString } from '@/common/util-browser';

export default class LibreFmScrobbler extends AudioScrobbler {
	/** @override */
	getApiUrl() {
		return 'https://libre.fm/2.0/';
	}

	/** @override */
	getApiKey() {
		return 'r8i1y91hz71tcx7vyrp9hk1alhqp1898';
	}

	/** @override */
	getApiSecret() {
		return '8187db5vg234yq6tm7o62q8mtl1niala';
	}

	/** @override */
	getBaseAuthUrl() {
		return 'https://www.libre.fm/api/auth/';
	}

	/** @override */
	getBaseProfileUrl() {
		return 'https://libre.fm/user/';
	}

	/** @override */
	getId() {
		return 'librefm';
	}

	/** @override */
	getLabel() {
		return 'Libre.fm';
	}

	/** @override */
	getStatusUrl() {
		return null;
	}

	/** @override */
	getStorageName() {
		return 'LibreFM';
	}

	/** @override */
	async sendRequest(options, params, signed) {
		if ('post' === options.method.toLowerCase()) {
			options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			options.body = createQueryString(params);
		}

		return super.sendRequest(options, params, signed);
	}
}
