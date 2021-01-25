import chai from 'chai';
import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';

import * as webExt from 'webextension-polyfill-ts';

import { mockedBrowser } from '#/mock/MockedBrowser';

setupChai();
setupBrowserStub();

function setupChai() {
	chai.use(spies);
	chai.use(chaiAsPromised);
}

function setupBrowserStub(): void {
	// @ts-ignore
	webExt.browser = mockedBrowser as webExt.Browser;
}
