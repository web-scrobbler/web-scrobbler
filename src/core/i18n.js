'use strict';

/**
 * Node attributes that define how node content will be localized.
 *
 * There're following supported attributes:
 *  - i18n: replace value of `textContent` property by localized text;
 *  - i18n-title: replace value of `title` attribute by localized text;
 *  - i18n-placeholder: replace value of `placeholder` attribute by localized text.
 *
 * @type {Array}
 */
const I18N_ATTRS = ['i18n', 'i18n-title', 'i18n-placeholder'];

$(() => {
	const domParser = new DOMParser();

	localizePage();

	/**
	 * Localize all nodes.
	 */
	function localizePage() {
		// Localize static nodes
		for (let attr of I18N_ATTRS) {
			let nodes = $(`[${attr}]`).toArray();
			localizeNodes(nodes);
		}

		// Localize dynamic nodes
		new MutationObserver((mutations) => {
			for (let mutation of mutations) {
				for (let node of mutation.addedNodes) {
					localizeNode(node);
					for (let attr of I18N_ATTRS) {
						let nodes = $(node).find(`[${attr}]`).toArray();
						localizeNodes(nodes);
					}
				}
			}
		}).observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	/**
	 * Localize given array of nodes.
	 * @param  {Array} nodes Array of nodes to be localized
	 */
	function localizeNodes(nodes) {
		nodes.forEach(localizeNode);
	}

	/**
	 * Localize given node.
	 * @param  {Object} node Node element
	 */
	function localizeNode(node) {
		if (!(node instanceof Element)) {
			return;
		}

		for (let attr of I18N_ATTRS) {
			if (!node.hasAttribute(attr)) {
				continue;
			}

			let tag = node.getAttribute(attr);
			let text = chrome.i18n.getMessage(tag) || tag;

			switch (attr) {
				case 'i18n':
					if (hasHtmlTags(text)) {
						let nodes = makeNodes(text);
						if (nodes) {
							nodes.forEach((n) => {
								node.appendChild(n);
							});
						} else {
							// Fallback
							node.textContent = text;
						}
					} else {
						node.textContent = text;
					}
					break;

				case 'i18n-title':
					node.setAttribute('title', text);
					break;

				case 'i18n-placeholder':
					node.setAttribute('placeholder', text);
					break;
			}
		}
	}

	/**
	 * Create array of nodes which can be applied to node to be translated.
	 * @param  {String} rawHtml String contains HTML code
	 * @return {Array} Array of nodes from given text
	 */
	function makeNodes(rawHtml) {
		let body = domParser.parseFromString(rawHtml, 'text/html').body;
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
});
