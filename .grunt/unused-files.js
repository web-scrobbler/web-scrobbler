const fs = require('fs');

const ROOT_DIR = '..';
const CONNECTORS_DIR = 'src/connectors/';

const SERVICE_FILES = ['.eslintrc.yml'];
const DOM_INJECT_SUFFIX = 'dom-inject.js';

const connectors = require(`${ROOT_DIR}/src/connectors.json`);
const manifest = require(`${ROOT_DIR}/src/manifest.json`);

module.exports = (grunt) => {
	grunt.registerTask('unused_files', 'Find unused files', () => {
		const unusedFiles = [
			...findUnusedConnectors(),
			...findUnusedDomInjects(),
		];

		const unusedCount = unusedFiles.length;
		if (unusedCount > 0) {
			const unusedFilesStr = unusedFiles.join(', ');
			grunt.fail.fatal(`Found ${unusedCount} unused files: ${unusedFilesStr}`);
		} else {
			grunt.log.ok('No unused files are found');
		}
	});
};

function findUnusedConnectors() {
	const files = fs.readdirSync(CONNECTORS_DIR).filter(isConnector).map(appendPrefix);
	const unusedFiles = [];

	for (const file of files) {
		let found = false;
		for (const entry of connectors) {
			if (entry.js === file) {
				found = true;
			}
		}

		if (!found) {
			unusedFiles.push(file);
		}
	}

	return unusedFiles;
}

function findUnusedDomInjects() {
	const files = fs.readdirSync(CONNECTORS_DIR).filter(isDomInject).map(appendPrefix);
	const resources = manifest.web_accessible_resources;
	const unusedFiles = [];

	for (const file of files) {
		let found = false;
		for (const resource of resources) {
			if (resource === file) {
				found = true;
			}
		}

		if (!found) {
			unusedFiles.push(file);
		}
	}

	return unusedFiles;
}

function appendPrefix(jsFile) {
	return `connectors/${jsFile}`;
}

function isConnector(file) {
	return !(SERVICE_FILES.includes(file) || isDomInject(file));
}

function isDomInject(file) {
	return file.endsWith(DOM_INJECT_SUFFIX);
}
