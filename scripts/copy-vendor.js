'use strict';

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const vendorDir = 'src/vendor';

const bootstrapJsDir = `${vendorDir}/bootstrap/js`;
const bootstrapCssDir = `${vendorDir}/bootstrap/css`;

const fonawesomeCssDir = `${vendorDir}/fontawesome/css`;
const fontawesomeWebfontsDir = `${vendorDir}/fontawesome/webfonts`;

const bootstrapDir = 'node_modules/bootstrap/dist';
const fontawesomeDir = 'node_modules/@fortawesome/fontawesome-free';

function mkdir(newPath) {
	return fsPromises.mkdir(newPath, {
		recursive: true
	}).catch((err) => {
		throw new Error(`Unable to make ${newPath}: ${err.code}`);
	}).then(() => {
		console.log(`Created ${newPath}`);
	});
}

function copyDep(srcPath, destDir = null) {
	const depName = path.basename(srcPath);
	const destPath = `${destDir || vendorDir}/${depName}`;

	fs.copyFile(srcPath, destPath, (err) => {
		if (err) {
			console.warn(`Unable to copy ${depName}: ${err.code}`);
			throw new Error(err);
		} else {
			console.log(`Copy ${depName}`);
		}
	});
}

mkdir(vendorDir).then(() => {
	copyDep('node_modules/requirejs/require.js');
	copyDep('node_modules/blueimp-md5/js/md5.min.js');
	copyDep('node_modules/jquery/dist/jquery.min.js');
	copyDep('node_modules/showdown/dist/showdown.min.js');
	copyDep('node_modules/webextension-polyfill/dist/browser-polyfill.min.js');
}).catch(console.error);

mkdir(bootstrapJsDir).then(() => {
	copyDep(`${bootstrapDir}/js/bootstrap.bundle.min.js`, bootstrapJsDir);
}).catch(console.error);

mkdir(bootstrapCssDir).then(() => {
	copyDep(`${bootstrapDir}/css/bootstrap.min.css`, bootstrapCssDir);
}).catch(console.error);

mkdir(fonawesomeCssDir).then(() => {
	copyDep(`${fontawesomeDir}/css/solid.min.css`, fonawesomeCssDir);
	copyDep(`${fontawesomeDir}/css/brands.min.css`, fonawesomeCssDir);
	copyDep(`${fontawesomeDir}/css/fontawesome.min.css`, fonawesomeCssDir);
}).catch(console.error);

mkdir(fontawesomeWebfontsDir).then(() => {
	copyDep(`${fontawesomeDir}/webfonts/fa-solid-900.woff2`, fontawesomeWebfontsDir);
	copyDep(`${fontawesomeDir}/webfonts/fa-brands-400.woff2`, fontawesomeWebfontsDir);
}).catch(console.error);
