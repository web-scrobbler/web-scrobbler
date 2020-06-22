'use strict';

import Vue from 'vue';

import { L } from '@/ui/i18n';

/**
 * Create a new instance of a Vue model.
 *
 * @param {Object} component Vue component instance
 */
export function createVueModel(component) {
	Vue.prototype.L = L;

	new Vue({
		render: (h) => h(component),
	}).$mount('#content');
}

/**
 * Export a given data to a JSON file.
 *
 * @param {Object} data Data to export
 * @param {String} fileName File name
 */
export function exportData(data, fileName) {
	const dataStr = JSON.stringify(data, null, 2);
	const blob = new Blob([dataStr], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.dispatchEvent(new MouseEvent('click'));
	a.remove();

	URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file choosen by a user.
 *
 * @return {Promise} Promise resolved with parsed data from a file.
 */
export async function importData() {
	const fileInput = document.createElement('input');
	document.body.append(fileInput);

	fileInput.style.display = 'none';
	fileInput.type = 'file';
	fileInput.accept = '.json';
	fileInput.acceptCharset = 'utf-8';
	fileInput.initialValue = fileInput.value;

	return new Promise((resolve) => {
		fileInput.addEventListener('change', readFile);
		fileInput.click();

		function readFile() {
			if (fileInput.value !== fileInput.initialValue) {
				const file = fileInput.files[0];

				const reader = new FileReader();
				reader.onloadend = (event) => {
					const dataStr = event.target.result;
					const contents = JSON.parse(dataStr);

					resolve(contents);
					fileInput.remove();
				};
				reader.readAsText(file, 'utf-8');
			}
		}
	});
}
