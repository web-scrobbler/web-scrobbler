import chai from 'chai';
import spies from 'chai-spies';

import * as webExt from 'webextension-polyfill-ts';

import { mockedBrowser } from '#/mock/MockedBrowser';

setupChai();
setupBrowserStub();

function setupChai() {
	chai.use(spies);
}

function setupBrowserStub(): void {
	// @ts-ignore
	webExt.browser = mockedBrowser as webExt.Browser;
}
