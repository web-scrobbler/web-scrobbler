const srcDir = 'src';
const buildDir = 'build';

const modeDevelopment = 'development';
const modeProduction = 'production';

const browserChrome = 'chrome';
const browserFirefox = 'firefox';

const supportedBrowsers = [browserChrome, browserFirefox];
const supportedModes = [modeDevelopment, modeProduction];

const extensionIds = {
	[browserChrome]: 'hhinaapppaileiechjoiifaancjggfjm',
	[browserFirefox]: '{799c0914-748b-41df-a25c-22d008f9e83f}',
};

const manifestFile = 'manifest.json';

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
 * Return an extension ID for a given browser.
 *
 * @param {String} browser Browser name
 *
 * @return {String} Extension ID
 */
function getExtensionId(browser) {
	assertBrowserIsSupported(browser);

	return extensionIds[browser];
}

module.exports = {
	assertBrowserIsSupported,
	assertBuildModeIsValid,
	getExtensionId,

	buildDir,
	srcDir,

	browserChrome,
	browserFirefox,

	modeDevelopment,
	modeProduction,

	manifestFile,
};
