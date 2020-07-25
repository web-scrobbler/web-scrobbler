const fs = require('fs');
const path = require('path');

const { preprocess } = require('preprocess');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
const backgroundPageEntry = 'background/index';

/**
 * A list of UI popup names. Each name is a name of HTML file of the popup.
 */
const uiPopups = [
	'ui/popups/disabled',
	'ui/popups/error',
	'ui/popups/go-play-music',
	'ui/popups/info',
	'ui/popups/unsupported',
];

/**
 * A list of UI page names. Each name is a directory where all files related
 * to the page are stored.
 */
const uiPages = ['ui/options'];

const defaultPopupTemplate = 'ui/popups/base-popup';

const iconsDir = 'icons';
const vendorDir = 'vendor';

const locales = '_locales/';
const vendorFiles = ['metadata-filter/dist/filter.js'];
const contentFiles = ['connectors/', 'content/'];
const projectFiles = [
	'LICENSE.md',
	'README.md',
	'package-lock.json',
	'package.json',
];

const preprocessFlagNames = {
	chrome: 'CHROME',
	development: 'DEBUG',
	firefox: 'FIREFOX',
	production: 'RELEASE',
};

const defaultBrowser = browserChrome;

const isDevServer = !!process.env.WEBPACK_DEV_SERVER;

/**
 * A list of CSS styles shared across UI modules. These styles will be extracted
 * as separate chunks.
 */
const sharedStyles = ['bootstrap', 'base'];

module.exports = (functionArg) => {
	const browser = getBrowserFromArgs(functionArg);
	assertBrowserIsSupported(browser);

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
						options: getPreprocessFlags(browser),
					},
				},
				{
					test: /\.svg$/,
					loader: 'svg-sprite-loader',
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
			],
		},
		optimization: createOptimization(),
		output: {
			chunkFilename: `${vendorDir}/[id].js`,
			filename: '[name].js',
			path: resolve(buildDir),
			publicPath: '/',
		},
		performance: { hints: false },
		plugins: createPlugins(browser),
		resolve: {
			alias: {
				'@': resolve(srcDir),
			},
			modules: ['node_modules'],
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
		return 'inline-source-map';
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

/**
 * Return a new entry object for a HTML page. This object is used to create
 * entrypoints and HtmlWebpackPlugin instances.
 *
 * @param {String} entryName Entry name
 * @param {String} [templateName] Template name used to create HTML file
 *
 * @return {Object} Entry object
 */
function getHtmlEntry(entryName, templateName = null) {
	const entryPath = getEntryJsPath(entryName);
	return { entryName, entryPath, templateName: templateName || entryName };
}

/**
 * Return an object containing flags for `preprocess` module.
 *
 * @param {String} browser Browser name
 *
 * @return {Object} Flags
 */
function getPreprocessFlags(browser) {
	return {
		[preprocessFlagNames[browser]]: true,
		[preprocessFlagNames[getMode()]]: true,
	};
}

/**
 * Return a new entry object for a given UI page.
 *
 * @param {String} page UI page name (the name of directory)
 *
 * @return {Object} Entry object
 */
function getUiPageJsEntry(page) {
	const entryName = `${page}/index`;
	return getHtmlEntry(entryName);
}

/**
 * Return a new entry object for a given UI popup.
 *
 * @param {String} popup UI popup name (the name of HTML file)
 *
 * @return {Object} Entry object
 */
function getUiPopupJsEntry(popup) {
	const entryName = popup;
	return getHtmlEntry(entryName, defaultPopupTemplate);
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
	const entries = {};

	const allEntries = [
		getHtmlEntry(backgroundPageEntry),
		...getUiPagesEntries(),
		...getUiPopupsEntries(),
	];
	for (const { entryName, entryPath } of allEntries) {
		entries[entryName] = entryPath;
	}

	return entries;
}

/**
 * Create an array of HtmlWebpackPlugin for a given list of entries.
 * Each entry can represent either an UI page, or an UI popup.
 *
 * @param {Array} entries Array of entries
 *
 * @return {Array} Array of webpack plugins
 */
function createHtmlPluginsFromEntries(entries) {
	const plugins = [];

	for (const { entryName, templateName } of entries) {
		plugins.push(
			new HtmlWebpackPlugin({
				chunks: [entryName],
				template: resolve(srcDir, `${templateName}.html`),
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

	const optimization = {
		runtimeChunk: 'multiple',
		minimizer: [
			new TerserJSPlugin({ sourceMap: true }),
			new OptimizeCSSAssetsPlugin({}),
		],
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/
						)[1];

						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
			minSize: 0,
			maxInitialRequests: Infinity,
		},
	};

	for (const style of sharedStyles) {
		optimization.splitChunks.cacheGroups[style] = {
			name: style,
			test: new RegExp(`${style}\\.css$`),
			chunks: 'all',
			enforce: true,
		};
	}

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
		...projectFiles.map((path) => {
			return {
				from: resolve(path),
				to: resolve(buildDir, path),
			};
		}),
		...contentFiles.map((path) => {
			return {
				from: `${srcDir}/${path}/*.js`,
				to: resolve(buildDir, path),
				transform(contents) {
					return preprocess(contents, getPreprocessFlags(browser), {
						type: 'js',
					});
				},
				flatten: true,
			};
		}),
		{
			from: `${srcDir}/${iconsDir}/*.png`,
			to: resolve(buildDir, iconsDir),
			flatten: true,
		},
		{
			from: resolve(srcDir, locales),
			to: resolve(buildDir, locales),
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
		new VueLoaderPlugin(),
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: !isDevServer }),
		new MiniCssExtractPlugin({
			chunkFilename: `${vendorDir}/[id].css`,
			filename: '[name].css',
		}),
		new CopyPlugin({ patterns }),
		...createHtmlPluginsFromEntries([getHtmlEntry(backgroundPageEntry)]),
		...createHtmlPluginsFromEntries(getUiPagesEntries()),
		...createHtmlPluginsFromEntries(getUiPopupsEntries()),
		new ImageminPlugin({
			disable: getMode() !== modeProduction,
		}),
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
