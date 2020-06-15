const fs = require('fs');
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

const {
	buildDir,
	srcDir,

	browserChrome,
	browserFirefox,

	modeDevelopment,
	modeProduction,

	manifestFile,

	assertBrowserIsSupported,
	getExtensionId,
} = require('./shared.config');

/**
 * A main entry point.
 */
const mainEntry = 'core/background/main';

/**
 * A path to the main entry point.
 */
const mainEntryPath = getEntryJsPath(mainEntry);

/**
 * A list of UI popup names. Each name is a name of HTML file of the popup.
 *
 * @type {Array<String>}
 */
const uiPopups = getUiPopupNames();

/**
 * A list of UI page names. Each name is a directory where all files related
 * to the page are stored.
 */
const uiPages = ['options'];

/**
 * A default chunk for UI popups with no chunk.
 */
const defaultPopupChunk = 'ui/popups/base-popup';

const chunkDir = 'shared';
const iconsDir = 'icons';
const vendorDir = 'vendor';

const vendorFiles = ['metadata-filter/dist/filter.js'];
const extensionFiles = ['_locales/', 'connectors/', 'core/content/'];
const projectFiles = [
	'LICENSE.md',
	'README.md',
	'package-lock.json',
	'package.json',
];

const preprocessorFlagNames = {
	chrome: 'CHROME',
	development: 'DEBUG',
	firefox: 'FIREFOX',
	production: 'RELEASE',
};

const defaultBrowser = browserChrome;

/**
 * A list of CSS styles shared across UI modules. These styles will be extracted
 * as separate chunks.
 */
const sharedStyles = ['bootstrap', 'base-popup', 'base'];

class WatchExtensionFilesPlugin {
	apply(compiler) {
		compiler.hooks.beforeCompile.tap(
			'WatchExtensionFilesPlugin',
			(params) => {
				for (const path of extensionFiles) {
					params.compilationDependencies.add(resolve(srcDir, path));
				}
			}
		);
	}
}

module.exports = (functionArg) => {
	const browser = getBrowserFromArgs(functionArg);
	assertBrowserIsSupported(browser);

	const preprocessorFlags = {
		[preprocessorFlagNames[browser]]: true,
		[preprocessorFlagNames[getMode()]]: true,
	};

	return {
		devtool: getDevtool(),
		devServer: {
			// https://github.com/webpack/webpack-dev-server/issues/1604
			disableHostCheck: true,
			hot: true,
			writeToDisk: true,
		},
		entry: createEntries(),
		mode: getMode(),
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
				{
					test: /\.html$/,
					loader: 'html-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.js$/,
					use: {
						loader: 'preprocess-loader',
						options: preprocessorFlags,
					},
				},
			],
		},
		optimization: createOptimization(),
		output: {
			chunkFilename: `${chunkDir}/[name].js`,
			filename: '[name].js',
			path: resolve(buildDir),
			publicPath: '/',
		},
		performance: { hints: false },
		plugins: createPlugins(browser),
		resolve: {
			alias: {
				connectors: resolve(srcDir, 'core', 'connectors'),
			},
			modules: [
				resolve(srcDir, 'core', 'background'),
				resolve(srcDir),
				'node_modules',
			],
		},
		stats: 'minimal',
	};
};

/**
 * Return a browser name from a command line argument.
 *
 * @param {String} functionArg Argument of the main function
 *
 * @return {String} Browser name
 */
function getBrowserFromArgs(functionArg) {
	if (functionArg) {
		return functionArg;
	}

	return process.argv[2] || defaultBrowser;
}

/**
 * Return a style of source mapping. Returns false (means no source maps are
 * generated) if the current mode is production.
 *
 * @return {String} Devtool name
 */
function getDevtool() {
	if (getMode() === modeProduction) {
		return 'source-map';
	}

	return 'eval-cheap-source-map';
}

/**
 * Return a path to a given entry.
 * If the path is not exists, return a null value.
 *
 * @param {String} entryName Full entry name
 *
 * @return {String} Path to entry
 */
function getEntryJsPath(entryName) {
	const jsPath = resolve(srcDir, `${entryName}.js`);
	if (fs.existsSync(jsPath)) {
		return jsPath;
	}

	return null;
}

/**
 * Get current mode from the Node.js environment variable. Return "development"
 * mode, if Node.js environment variable is not set.
 *
 * @return {String} Mode value
 */
function getMode() {
	return process.env.NODE_ENV || modeDevelopment;
}

function getUiPopupNames() {
	return ['disabled', 'go-play-music', 'error', 'unsupported'];
	// const popupsDir = resolve('src/ui/popups/');

	// return fs
	// 	.readdirSync(popupsDir)
	// 	.filter((file) => {
	// 		return file.endsWith('.html');
	// 	})
	// 	.map((file) => {
	// 		return path.basename(file, '.html');
	// 	});
}

/**
 * Return a new entry object for a given UI page.
 *
 * @param {String} page UI page name (the name of directory)
 *
 * @return {Object} Entry object
 */
function getUiPageJsEntry(page) {
	const entryName = `ui/${page}/index`;
	const entryPath = getEntryJsPath(entryName);

	return { entryName, entryPath };
}

/**
 * Return a new entry object for a given UI popup.
 *
 * @param {String} popup UI popup name (the name of HTML file)
 *
 * @return {Object} Entry object
 */
function getUiPopupJsEntry(popup) {
	const entryName = `ui/popups/${popup}`;
	const entryPath = getEntryJsPath(entryName);

	return { entryName, entryPath };
}

/**
 * Get an array of UI pages entries.
 *
 * @return {Array} Array of UI pages entries
 */
function getUiPagesEntries() {
	return uiPages.map((page) => getUiPageJsEntry(page));
}

/**
 * Get an array of UI popups entries.
 *
 * @return {Array} Array of UI popups entries
 */
function getUiPopupsEntries() {
	return uiPopups.map((popup) => getUiPopupJsEntry(popup));
}

/**
 * Create a list of enty points.
 *
 * @return {Object} Object containting entry points
 */
function createEntries() {
	const entries = {
		[mainEntry]: resolve(mainEntryPath),
	};

	const uiEntries = [
		...getUiPagesEntries(),
		...getUiPopupsEntries(),

		getUiPopupJsEntry('base-popup'),
	];
	for (const { entryName, entryPath } of uiEntries) {
		if (entryPath !== null) {
			entries[entryName] = entryPath;
		}
	}

	return entries;
}

/**
 * Create an array of HtmlWebpackPlugin for a given list of entries.
 *
 * Each entry can represent either an UI page, or an UI popup. If an entry has
 * no chunk (i.e. no custom JS file), a default chunk will be used instead.
 *
 * @param {Array} entries Array of entries
 * @param {String} defaultChunk Default chunk used as a fallback value
 *
 * @return {Array} Array of webpack plugins
 */
function createHtmlPluginsFromEntries(entries, defaultChunk = null) {
	const plugins = [];

	for (const { entryName, entryPath } of entries) {
		let chunk = entryName;

		if (entryPath === null) {
			if (defaultChunk === null) {
				throw new Error(`No chunk for ${entryName} is specified`);
			}

			chunk = defaultChunk;
		}

		plugins.push(
			new HtmlWebpackPlugin({
				chunks: [chunk],
				template: resolve(srcDir, `${entryName}.html`),
				filename: `${entryName}.html`,
			})
		);
	}

	return plugins;
}

/**
 * Return an optimization object. Used in production mode only.
 *
 * @return {Object} Optimization object
 */
function createOptimization() {
	if (getMode() === modeDevelopment) {
		return undefined;
	}

	const optimization = {};
	const cacheGroups = {};

	optimization.minimizer = [
		new TerserJSPlugin({
			sourceMap: true,
		}),
		new OptimizeCSSAssetsPlugin({}),
	];

	cacheGroups.vendors = {
		name: 'vendors',
		test: /[\\/]node_modules[\\/]/,
		chunks: 'all',
		enforce: true,
	};

	for (const style of sharedStyles) {
		cacheGroups[style] = {
			name: style,
			test: new RegExp(`${style}\\.css$`),
			chunks: 'all',
			enforce: true,
		};
	}
	optimization.splitChunks = { cacheGroups };

	return optimization;
}

/**
 * Create a list of webpack plugins used to build the extension.
 *
 * @param {String} browser Browser name
 *
 * @return {Array} Array of webpack plugins
 */
function createPlugins(browser) {
	const patterns = [
		...vendorFiles.map((path) => {
			return {
				from: resolve('node_modules', path),
				to: resolve(buildDir, vendorDir),
			};
		}),
		...extensionFiles.map((path) => {
			return {
				from: resolve(srcDir, path),
				to: resolve(buildDir, path),
			};
		}),
		...projectFiles.map((path) => {
			return {
				from: resolve(path),
				to: resolve(buildDir, path),
			};
		}),
		{
			from: `${srcDir}/${iconsDir}/*.png`,
			to: resolve(buildDir, iconsDir),
			flatten: true,
		},
		{
			from: resolve(srcDir, manifestFile),
			to: resolve(buildDir, manifestFile),
			transform(contents) {
				return transformManifest(contents, browser);
			},
		},
	];

	return [
		new MiniCssExtractPlugin({
			chunkFilename: `${chunkDir}/[name].css`,
			filename: '[name].css',
		}),
		new CopyPlugin({ patterns }),
		...createHtmlPluginsFromEntries(getUiPagesEntries()),
		...createHtmlPluginsFromEntries(getUiPopupsEntries(), defaultPopupChunk),
		new ImageminPlugin({
			disable: getMode() !== modeProduction,
		}),
		new WatchExtensionFilesPlugin(),
	];
}

function resolve(...p) {
	return path.resolve(__dirname, ...p);
}

/**
 * Update manifest object for a given browser.
 *
 * @param {Object} contents Manifest contents
 * @param {String} browser Browser name
 *
 * @return {String} Transfrormed manifest contents
 */
function transformManifest(contents, browser) {
	const manifest = JSON.parse(contents);

	switch (browser) {
		case browserChrome: {
			delete manifest.options_ui;
			break;
		}

		case browserFirefox: {
			manifest.browser_specific_settings = {
				gecko: {
					id: getExtensionId(browserFirefox),
					strict_min_version: '53.0',
				},
			};

			manifest.icons['48'] = 'icons/icon_firefox_48.png';
			manifest.icons['128'] = 'icons/icon_firefox_128.png';

			delete manifest.options_page;
			break;
		}
	}

	if (getMode() === modeDevelopment) {
		manifest['content_security_policy'] =
			// eslint-disable-next-line quotes
			"script-src 'self' 'unsafe-eval'; object-src 'self'";
	}

	return JSON.stringify(manifest, null, 2);
}
