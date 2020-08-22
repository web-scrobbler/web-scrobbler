import { createApp, Component } from 'vue';

import { L } from '@/common/i18n';

const rootElementSelector = '#content';

const i18nMixin = {
	methods: { L },
};

const removeSvgTitleMixin = {
	mounted() {
		document.querySelectorAll('svg title').forEach((element) => {
			element.remove();
		});
	},
};

/**
 * Create a new instance of a Vue model.
 *
 * @param component Vue component instance
 */
export function createVueApp(component: Component): void {
	createApp(component)
		.mixin(i18nMixin)
		.mixin(removeSvgTitleMixin)
		.mount(rootElementSelector);
}
