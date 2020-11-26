const path = require('path');

const srcDir = 'src';
const buildDir = 'build';

const modeDevelopment = 'development';
const modeProduction = 'production';

const browserChrome = 'chrome';
const browserFirefox = 'firefox';

const supportedBrowsers = [browserChrome, browserFirefox];
const supportedModes = [modeDevelopment, modeProduction];

const manifestFile = 'manifest.json';
const manifestData = {
	[browserChrome]: 'manifest-chrome.json',
	[browserFirefox]: 'manifest-firefox.json',
};

/**
 * Throw an error if the extension doesn't support a given browser.
 *
 * @param {String} browser Browser name
 *
 * @throws {TypeError}
 */
function assertBrowserIsSupported(browser) {
	const browsersLabel = `Supported browsers: ${supportedBrowsers.join(', ')}`;

	if (!browser) {
		throw new TypeError(
			`You have not specified browser.\n${browsersLabel}.`
		);
	}

	if (!supportedBrowsers.includes(browser)) {
		throw new TypeError(`Unknown browser: ${browser}.\n${browsersLabel}.`);
	}
}

/**
 * Throw an error if the extension doesn't support a given mode.
 *
 * @param {String} mode Mode
 *
 * @throws {TypeError}
 */
function assertBuildModeIsValid(mode) {
	const modesLabel = `Supported modes: ${supportedModes.join(', ')}`;

	if (!mode) {
		throw new TypeError(`You have not specified mode.\n${modesLabel}.`);
	}

	if (!supportedModes.includes(mode)) {
		throw new TypeError(`Unknown mode: ${mode}.\n${modesLabel}.`);
	}
}

/**
 * Configure TypeScipt compiler to run tests written in TypeScript.
 *
 * This configuration allows to use Mocha as a test framework, and Istanbul as
 * a coverage tool.
 */
function configureTsCompilerForTests() {
	const tsconfigForTests = {
		// Set the module type to "CommonJS" to allow run compiled TS files
		module: 'CommonJS',
		// Enable this option to allow to import JSON files when the module type
		// is "CommonJS"
		esModuleInterop: true,
	};

	process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify(tsconfigForTests);
}

/**
 * Return browser-specific data that should be applied to the manifest.
 *
 * @param  {String} browser Browser name
 *
 * @return {Object} Manifest data
 */
function getBrowserSpecificManifestData(browser) {
	const browserManifestFile = manifestData[browser];

	return require(resolve(srcDir, browserManifestFile));
}

function resolve(...p) {
	return path.resolve(__dirname, ...p);
}

module.exports = {
	assertBrowserIsSupported,
	assertBuildModeIsValid,
	configureTsCompilerForTests,
	getBrowserSpecificManifestData,
	resolve,

	buildDir,
	srcDir,

	browserChrome,
	browserFirefox,

	modeDevelopment,
	modeProduction,

	manifestFile,
};
