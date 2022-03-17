'use strict';

/* eslint-disable no-template-curly-in-string */

const bootstrapDir = 'bootstrap/dist';
const fontawesomeDir = '@fortawesome/fontawesome-free';

const rootDir = '.';

const vendorDir = `${rootDir}/src/vendor`;
const packageJsonPath = './../package.json';

const dependenciesInfo = {
	'blueimp-md5': {
		name: 'MD5',
		urlTemplate: 'https://github.com/blueimp/JavaScript-MD5/archive/v${ver}.zip',
		paths: [{
			srcPaths: [
				'blueimp-md5/js/md5.min.js',
			],
		}],
	},
	'metadata-filter': {
		name: 'MetadataFilter',
		urlTemplate: 'https://github.com/web-scrobbler/metadata-filter/releases/download/v${ver}/metadata-filter-${ver}.tgz',
		paths: [{
			srcPaths: [
				'metadata-filter/dist/filter.js',
			],
		}],
	},
	'webextension-polyfill': {
		name: 'WebextPolyfill',
		urlTemplate: 'https://unpkg.com/browse/webextension-polyfill@${ver}/dist/',
		paths: [{
			srcPaths: [
				'webextension-polyfill/dist/browser-polyfill.min.js',
			],
		}],
	},
	jquery: {
		name: 'jQuery',
		urlTemplate: 'https://code.jquery.com/jquery-${ver}.min.js',
		paths: [{
			srcPaths: [
				'jquery/dist/jquery.min.js',
			],
		}],
	},
	requirejs: {
		name: 'RequireJS',
		urlTemplate: 'https://github.com/requirejs/requirejs/archive/${ver}.zip',
		paths: [{
			srcPaths: [
				'requirejs/require.js',
			],
		}],
	},

	'@fortawesome/fontawesome-free': {
		name: 'FontAwesome',
		urlTemplate: 'https://use.fontawesome.com/releases/v${ver}/fontawesome-free-${ver}-web.zip',
		paths: [{
			srcPaths: [
				`${fontawesomeDir}/css/solid.min.css`,
				`${fontawesomeDir}/css/brands.min.css`,
				`${fontawesomeDir}/css/fontawesome.min.css`,
			],
			destDir: `${vendorDir}/fontawesome/css`,
		}, {
			srcPaths: [
				`${fontawesomeDir}/webfonts/fa-solid-900.woff2`,
				`${fontawesomeDir}/webfonts/fa-brands-400.woff2`,
			],
			destDir: `${vendorDir}/fontawesome/webfonts`,
		}],
	},
	bootstrap: {
		name: 'Bootstrap',
		urlTemplate: 'https://github.com/twbs/bootstrap/releases/download/v${ver}/bootstrap-${ver}-dist.zip',
		paths: [{
			srcPaths: [
				`${bootstrapDir}/js/bootstrap.bundle.min.js`,
			],
			destDir: `${vendorDir}/bootstrap/js`,
		}, {
			srcPaths: [
				`${bootstrapDir}/css/bootstrap.min.css`,
			],
			destDir: `${vendorDir}/bootstrap/css`,
		}],
	},
};

function getDependencies(packageJson) {
	const dependenciesArr = [];
	const { dependencies } = packageJson;

	for (const id in dependencies) {
		const version = dependencies[id];

		dependenciesArr.push({ id, version });
	}

	return dependenciesArr;
}

module.exports = {
	dependenciesInfo, getDependencies, rootDir, vendorDir, packageJsonPath,
};
