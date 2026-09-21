import { beforeEach, describe, expect, it } from 'vitest';
// @vitest-environment happy-dom

import '#/mocks/webextension-polyfill';
import type { ConnectorMeta } from '@/core/connectors';
import BaseConnector from '@/core/content/connector';

const META: ConnectorMeta = {
	label: 'Test',
	matches: ['*://example.com/*'],
	js: 'test.js',
	id: 'test',
};

/*
 * happy-dom does not compute layout: offsetWidth/offsetHeight are always 0
 * and getClientRects() returns 1 rect even for display:none elements,
 * which breaks Util.isElementVisible's visibility check (util.ts:605).
 * Shim the layout getters so the visibility check behaves like a browser.
 */
for (const proto of [HTMLElement.prototype, SVGElement.prototype]) {
	Object.defineProperties(proto, {
		offsetWidth: {
			configurable: true,
			get(this: HTMLElement) {
				return this.style.display === 'none' ? 0 : 100;
			},
		},
		offsetHeight: {
			configurable: true,
			get(this: HTMLElement) {
				return this.style.display === 'none' ? 0 : 100;
			},
		},
		getClientRects: {
			configurable: true,
			value(this: HTMLElement) {
				return this.style.display === 'none'
					? []
					: [this.getBoundingClientRect()];
			},
		},
	});
}

function el(tag: string, hidden = false): HTMLElement {
	const element = document.createElement(tag);
	if (hidden) {
		element.style.display = 'none';
	}
	document.body.append(element);
	return element;
}

describe('BaseConnector.isPlaying', () => {
	let connector: BaseConnector;

	beforeEach(() => {
		document.body.textContent = '';
		connector = new BaseConnector(META);
	});
	it('assumes playing when no play/pause selector is set', () => {
		expect(connector.isPlaying()).toBe(true);
	});

	it('reports paused when only pause selector is set and pause button is hidden (#6230/#6231)', () => {
		connector.pauseButtonSelector = '#pause';
		// Hidden pause button = site is paused. Pre-#6231 fallback returned true (bug).
		el('div', true).id = 'pause';
		expect(connector.isPlaying()).toBe(false);
	});

	it('reports playing when only pause selector is set and pause button is visible', () => {
		connector.pauseButtonSelector = '#pause';
		el('div', false).id = 'pause';
		expect(connector.isPlaying()).toBe(true);
	});

	it('reports paused when pause button is missing but only pause selector set', () => {
		connector.pauseButtonSelector = '#pause';
		// No element in DOM at all — isElementVisible is false → not playing
		expect(connector.isPlaying()).toBe(false);
	});

	it('reports paused when only play selector is set and play button is visible', () => {
		connector.playButtonSelector = '#play';
		// Visible play button = site is paused
		el('div', false).id = 'play';
		expect(connector.isPlaying()).toBe(false);
	});

	it('reports playing when only play selector is set and play button is hidden', () => {
		connector.playButtonSelector = '#play';
		// Hidden play button = site is playing
		el('div', true).id = 'play';
		expect(connector.isPlaying()).toBe(true);
	});

	it('reports playing when play button is missing but only play selector set', () => {
		connector.playButtonSelector = '#play';
		// Element absent — isElementVisible returns false → notPaused true
		expect(connector.isPlaying()).toBe(true);
	});
	// both, pause hidden, play visible → playing=false wins over notPaused()=false
	it('reports paused when both set, pause hidden, play visible', () => {
		connector.pauseButtonSelector = '#pause';
		connector.playButtonSelector = '#play';
		el('div', true).id = 'pause';
		el('div', false).id = 'play';
		expect(connector.isPlaying()).toBe(false);
	});
});
