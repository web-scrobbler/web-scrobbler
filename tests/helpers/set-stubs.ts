import browserStub from '#/stubs/browser';
import * as webExt from 'webextension-polyfill-ts';

// @ts-ignore
webExt.browser = browserStub as webExt.Browser;
