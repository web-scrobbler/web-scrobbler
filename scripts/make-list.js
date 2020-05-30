'use strict';

/* eslint-disable no-template-curly-in-string */


const { writeFileSync } = require('fs');

const requestHttp = require('http').request;
const requestHttps = require('https').request;

const {
	dependenciesInfo, getDependencies, packageJsonPath,
} = require('./dep-data');

const emptyLine = '';

const versionPlaceholderRe = /\${ver}/g;

const options = { method: 'HEAD' };
const okStatusCodes = [200, 301, 302];

const outputFilePath = './3RD-PARTY.md';

async function main() {
	const packageJson = require(packageJsonPath);
	const dependencies = getDependencies(packageJson);

	await generateInfoFile(dependencies);
}

async function generateInfoFile(dependencies) {
	try {
		const contents = await generateContents(dependencies);
		writeFileSync(outputFilePath, contents);
	} catch (err) {
		console.log(err.message);
	}
}

async function generateContents(dependencies) {
	const depInfoArr = [];

	for (const { id, version } of dependencies) {
		const { name } = dependenciesInfo[id];

		const { urlTemplate } = dependenciesInfo[id];
		const url = urlTemplate.replace(versionPlaceholderRe, version);

		depInfoArr.push({ id, name, url, version });
	}

	await Promise.all(depInfoArr.map(({ id, url }) => {
		return getHeadResponse(url).then((response) => {
			const { statusCode } = response;

			// console.log(id);
			// console.log(url);
			// console.log(statusCode);
			// console.log('');

			if (!okStatusCodes.includes(statusCode)) {
				throw new Error(`Invalid URL of ${id} dependency: ${url}`);
			}
		});
	}));

	depInfoArr.sort((a, b) => {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	const buf = [];

	buf.push(
		'<!-- This file is generated automatically. Do not edit it manually. -->\n'
	);

	buf.push('# Web Scrobbler\n');
	buf.push('## Third-party projects\n');

	for (const depInfo of depInfoArr) {
		const { id, name, version } = depInfo;

		buf.push(`-   [${name} v${version}][${id}]`);
	}
	buf.push(emptyLine);

	for (const depInfo of depInfoArr) {
		const { id, url } = depInfo;

		buf.push(`[${id}]: ${url}`);
	}
	buf.push(emptyLine);

	return buf.join('\n');
}

async function getHeadResponse(url) {
	return new Promise((resolve, reject) => {
		const req = getRequestFunction(url)(url, options, (r) => {
			resolve(r);
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.end();
	});
}

function getRequestFunction(urlStr) {
	const url = new URL(urlStr);

	switch (url.protocol) {
		case 'http:':
			return requestHttp;

		case 'https:':
			return requestHttps;
	}

	throw new Error(`Unsupported "${url.protocol}" protocol in ${urlStr}`);
}

main();
