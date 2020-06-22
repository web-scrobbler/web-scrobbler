import Vue from 'vue';

import { L } from '@/common/i18n';

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

Vue.mixin(i18nMixin);
Vue.mixin(removeSvgTitleMixin);

/**
 * Create a new instance of a Vue model.
 *
 * @param {Object} component Vue component instance
 */
export function createApp(component) {
	new Vue({
		render: (h) => h(component),
	}).$mount('#content');
}
