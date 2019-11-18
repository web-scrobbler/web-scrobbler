'use strict';

const controllerMode = {
	isActive(mode) {
		return activeModes.includes(mode);
	},

	isInactive(mode) {
		return inactiveModes.includes(mode);
	},

	Base: 'Base',
	Disabled: 'Disabled',
	Error: 'Error',
	Ignored: 'Ignored',
	Loading: 'Loading',
	Paused: 'Paused',
	Playing: 'Playing',
	Scrobbled: 'Scrobbled',
	Skipped: 'Skipped',
	Unknown: 'Unknown',
};

const activeModes = [
	controllerMode.Error,
	controllerMode.Ignored,
	controllerMode.Loading,
	controllerMode.Playing,
	controllerMode.Scrobbled,
	controllerMode.Skipped,
	controllerMode.Unknown
];

const inactiveModes = [
	controllerMode.Base,
	controllerMode.Disabled
];

define(() => controllerMode);
