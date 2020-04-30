'use strict';

const helpBtnId = 'help-btn';
const descContainerId = 'description';

function main() {
	const helpButton = document.getElementById(helpBtnId);

	helpButton.addEventListener('click', () => {
		showDescription();
	});
}

function showDescription() {
	const descContainer = document.getElementById(descContainerId);
	descContainer.removeAttribute('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
	main();
});
