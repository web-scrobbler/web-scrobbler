'use strict';

/**
 * Node attributes that define how node content will be localized.
 *
 * There're following supported attributes:
 *  - data-i18n: replace value of `textContent` property by localized text;
 *  - data-i18n-title: replace value of `title` attribute by localized text;
 *  - data-i18n-placeholder: replace value of `placeholder` attribute by localized text.
 *
 * @type {Array}
 */
const I18N_ATTRS = ['data-i18n', 'data-i18n-title', 'data-i18n-placeholder'];

const domParser = new DOMParser();

/**
 * Localize all nodes.
 */
function localizeDocument() {
	// Localize static nodes
	localizeElementChilds(document);

	// Localize dynamic nodes
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				localizeElement(node);
				localizeElementChilds(node);
			}
		}
	}).observe(document.body, {
		childList: true,
		subtree: true,
	});
}

/**
 * Localize given element.
 * @param  {Object} element Element to localize
 */
function localizeElement(element) {
	if (!(element instanceof Element)) {
		return;
	}

	for (const attr of I18N_ATTRS) {
		if (!element.hasAttribute(attr)) {
			continue;
		}

		const tag = element.getAttribute(attr);
		const text = chrome.i18n.getMessage(tag) || tag;

		switch (attr) {
			case 'data-i18n':
				if (hasHtmlTags(text)) {
					const nodes = makeNodes(text);
					if (nodes) {
						nodes.forEach((n) => {
							element.appendChild(n);
						});
					} else {
						// Fallback
						element.textContent = text;
					}
				} else {
					element.textContent = text;
				}
				break;

			case 'data-i18n-title':
				element.setAttribute('title', text);
				break;

			case 'data-i18n-placeholder':
				element.setAttribute('placeholder', text);
				break;
		}
	}
}

/**
 * Localize children of given element.
 * @param  {Object} element Element to localize
 */
function localizeElementChilds(element) {
	switch (element.nodeType) {
		case Node.ELEMENT_NODE:
		case Node.DOCUMENT_NODE:
			for (const attr of I18N_ATTRS) {
				const nodes = element.querySelectorAll(`[${attr}]`);
				nodes.forEach(localizeElement);
			}
			break;
	}
}

/**
 * Create array of nodes which can be applied to node to be translated.
 * @param  {String} rawHtml String contains HTML code
 * @return {Array} Array of nodes from given text
 */
function makeNodes(rawHtml) {
	const body = domParser.parseFromString(rawHtml, 'text/html').body;
	return [...body.childNodes].filter((a) => {
		return a.nodeType === a.TEXT_NODE || a.tagName === 'A';
	});
}

/**
 * Check if given text contains HTML tags
 * @param  {String} text String supposed to have HTML tags
 * @return {Boolean} Check result
 */
function hasHtmlTags(text) {
	return /<.+?>/.test(text);
}

localizeDocument();
