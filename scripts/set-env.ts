import { isDev, releaseTarget } from './util';

if (isDev()) {
	process.env.VITE_DEV = 'true';
} else {
	process.env.VITE_PROD = 'true';
}

switch (releaseTarget) {
	case 'chrome':
		process.env.VITE_CHROME = 'true';
		break;
	case 'firefox':
		process.env.VITE_FIREFOX = 'true';
		break;
	case 'safari':
		process.env.VITE_SAFARI = 'true';
		break;
	default:
		throw new Error('Unknown release target');
}
