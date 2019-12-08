'use strict';

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const vendor = 'src/vendor';

const bootstrapJS = `${vendor}/bootstrap/js`;
const bootstrapCSS = `${vendor}/bootstrap/css`;

const fonawesomeCSS = `${vendor}/fontawesome/css`;
const fontawesomeWebfonts = `${vendor}/fontawesome/webfonts`;

const bootstrapDist = 'node_modules/bootstrap/dist';
const fontawesomeDist = 'node_modules/@fortawesome/fontawesome-free';

async function mkDirCatch(newPath, callBack) {
	await fsPromises.mkdir(newPath, {
		recursive: true
	}).then(() => {
		console.log(`Path Created ${newPath}`);
		callBack();
	}).catch((err) => {
		if (err) {
			if (err.code === 'EEXIST') {
				console.log(`Path Exists ${newPath}`);
			} else {
				console.warn(`Path Create Failed ${err.code} https://nodejs.org/api/errors.html#errors_error_code_1`);
			}
		}
	});
}

function copyDep(src, inDest) {

	const dest = typeof inDest === 'undefined' ? vendor : inDest;
	const dep = path.basename(src);

	fs.copyFile(src, dest + path.sep + dep, (err) => {
		if (err) {
			if (err.code === 'EEXIST') {
				console.log(`Exists ${dep}`);
			} else {
				console.warn(`File Create Failed ${err.code} https://nodejs.org/api/errors.html#errors_error_code_1`);
			}
		} else {
			console.log(`Copy ${dep}`);
		}
	});
}

mkDirCatch(vendor, function() {
	copyDep('node_modules/requirejs/require.js');
	copyDep('node_modules/blueimp-md5/js/md5.min.js');
	copyDep('node_modules/jquery/dist/jquery.min.js');
	copyDep('node_modules/showdown/dist/showdown.min.js');
	copyDep('node_modules/webextension-polyfill/dist/browser-polyfill.min.js');
});

mkDirCatch(bootstrapJS, function() {
	copyDep(`${bootstrapDist}/js/bootstrap.bundle.min.js`, bootstrapJS);
});

mkDirCatch(bootstrapCSS, function() {
	copyDep(`${bootstrapDist}/css/bootstrap.min.css`, bootstrapCSS);
});

mkDirCatch(fonawesomeCSS, function() {
	copyDep(`${fontawesomeDist}/css/solid.min.css`, fonawesomeCSS);
	copyDep(`${fontawesomeDist}/css/brands.min.css`, fonawesomeCSS);
	copyDep(`${fontawesomeDist}/css/fontawesome.min.css`, fonawesomeCSS);
});

mkDirCatch(fontawesomeWebfonts, function() {
	copyDep(`${fontawesomeDist}/webfonts/fa-solid-900.woff2`, fontawesomeWebfonts);
	copyDep(`${fontawesomeDist}/webfonts/fa-brands-400.woff2`, fontawesomeWebfonts);
});
