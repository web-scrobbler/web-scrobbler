'use strict';

/* eslint-disable no-template-curly-in-string */

const { mkdirSync, copyFileSync } = require('fs');
const { basename } = require('path') ;

const {
	dependenciesInfo, getDependencies,
	rootDir, vendorDir, packageJsonPath,
} = require('./dep-data');

function main() {
	const packageJson = require(packageJsonPath);
	const dependencies = getDependencies(packageJson);

	copyDependencies(dependencies);
}

function copyDependencies(dependencies) {
	for (const dep of dependencies) {
		if (!(dep.id in dependenciesInfo)) {
			console.log(`Skip ${dep.id}`);
			continue;
		}

		const { paths } = dependenciesInfo[dep.id];
		for (const entry of paths) {
			copyDependencyFiles(entry);
		}

		console.log(`Copied ${dep.id}`);
	}
}

function copyDependencyFiles(dependencyInfo) {
	let { srcPaths, destDir } = dependencyInfo;
	if (!destDir) {
		destDir = vendorDir;
	}

	mkdirSync(destDir, { recursive: true });

	for (const srcPath of srcPaths) {
		const depFileName = basename(srcPath);
		const destPath = `${destDir}/${depFileName}`;
		const fullSrcPath = `${rootDir}/node_modules/${srcPath}`;

		copyFileSync(fullSrcPath, destPath);
	}
}


main();
