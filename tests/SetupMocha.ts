import chai from 'chai';
import spies from 'chai-spies';

import * as webExt from 'webextension-polyfill-ts';

import { browserStub } from '#/stubs/browser';

setupChai();
setupBrowserStub();

function setupChai() {
	chai.use(spies);
}

function setupBrowserStub(): void {
	// @ts-ignore
	webExt.browser = browserStub as webExt.Browser;
}
