import browser from 'webextension-polyfill';
import type { ControllerUIConnector } from './controller-ui-connector';
import * as Util from '@/core/content/util';
import type Song from '@/core/object/song';
import type { ControllerModeStr } from './controller';

export default class ControllerUI {
	constructor(private connector: ControllerUIConnector) {}

	public async getInfoBoxElement(): Promise<HTMLDivElement | null> {
		if (!this.connector.scrobbleInfoLocationSelector) {
			return null;
		}

		const parentEl = document.querySelector(
			this.connector.scrobbleInfoLocationSelector,
		);
		if (!parentEl) {
			return null;
		}

		// check if infoBoxEl was already created
		let infoBoxElement = document.querySelector<HTMLDivElement>(
			'#scrobbler-infobox-el',
		);

		// check if element is still in the correct place
		if (infoBoxElement) {
			if (infoBoxElement.parentElement !== parentEl) {
				infoBoxElement.remove();
			} else {
				return infoBoxElement;
			}
		}

		// if it was not in the correct place or didn't exist, create it
		infoBoxElement = document.createElement('div');
		infoBoxElement.setAttribute('id', 'scrobbler-infobox-el');

		// style the infobox
		for (const prop in this.connector.scrobbleInfoStyle) {
			infoBoxElement.style[prop] =
				this.connector.scrobbleInfoStyle[prop] ?? '';
		}

		parentEl.appendChild(infoBoxElement);
		return infoBoxElement;
	}

	public async updateInfoBox(
		mode: ControllerModeStr,
		currentSong: Song | null,
	) {
		let oldInfoBoxText: string | false = false;
		const infoBoxElement = await this.getInfoBoxElement();
		if (!infoBoxElement) {
			// clean up
			const infoBoxElement = document.querySelector<HTMLDivElement>(
				'#scrobbler-infobox-el',
			);
			if (infoBoxElement) {
				infoBoxElement.remove();
			}
			return;
		}
		const textEl = infoBoxElement.querySelector('span');
		if (textEl) {
			oldInfoBoxText = textEl.innerText;
		}

		const infoBoxText = Util.getInfoBoxText(mode, currentSong);

		// Check if infobox needs to be updated
		if (!oldInfoBoxText || infoBoxText !== oldInfoBoxText) {
			const img = document.createElement('img');
			img.setAttribute(
				'src',
				browser.runtime.getURL('./icons/icon_main_48.png'),
			);
			img.setAttribute('alt', 'Web Scrobbler state:');
			img.setAttribute('style', 'height: 1.2em');

			const info = document.createElement('span');
			info.innerText = infoBoxText;

			// Clear old contents of infoBoxElement
			while (infoBoxElement.firstChild) {
				infoBoxElement.removeChild(infoBoxElement.firstChild);
			}
			infoBoxElement.appendChild(img);
			infoBoxElement.appendChild(info);
		}
	}

	public cleanup(): void {
		document
			.querySelector<HTMLDivElement>('#scrobbler-infobox-el')
			?.remove();
	}
}
