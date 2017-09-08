'use strict';

/**
 * Node attributes that define how node content will be localized.
 *
 * There're following supported attributes:
 *  - i18n: replace value of `innerHTML` property by localized text;
 *  - i18n-title: replace value of `title` attribute by localized text;
 *  - i18n-placeholder: replace value of `placeholder` attribute by localized text.
 *
 * @type {Array}
 */
const I18N_ATTRS = ['i18n', 'i18n-title', 'i18n-placeholder'];

$(() => {
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
					node.innerHTML = text;
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
});
