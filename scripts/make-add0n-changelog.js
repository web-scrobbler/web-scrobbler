#!/usr/bin/env node

'use strict';

/**
 * The script generates JSON file that contains changelog for add0n.com website.
 */

const fs = require('fs');
const path = require('path');

const GitHubApi = require('github');

const CONTENT_DIRECTORY = '.add0n';
const CHANGELOG_DATA_FILENAME = 'changelog.json';

const repo = { owner: 'david-sabata', repo: 'web-scrobbler' };
const mdUrlRegEx = /\[(.+?)\]\(.+?\)/g; // [desc](URL)
const mdLiRegEx = /\*\s(.+)/g; // * Text

/**
 * Entry point.
 */
function main() {
	return getChangelog().then((changelog) => {
		let filepath = path.join(CONTENT_DIRECTORY, CHANGELOG_DATA_FILENAME);
		let changelogData = `${JSON.stringify(changelog, null, 2)}\n`;

		fs.writeFileSync(filepath, changelogData);
	});
}

/**
 * Get changelog object that is used on add0n.com website.
 * @return {Object} Changelog object
 */
function getChangelog() {
	let github = new GitHubApi();
	return github.repos.getLatestRelease(repo).then((release) => {
		let changelog = stripMarkdown(release.data.body);
		let version = release.data.tag_name.substring(1); // skip "v" prefix
		let created = reformatDate(release.data.published_at);

		return {
			results: [{
				release_notes: {
					'en-US': changelog
				},
				files: [{
					created
				}],
				version
			}]
		};
	});
}

/**
 * Strip MarkDown URLs.
 * @param  {String} text Markdown source
 * @return {String} Formatted text
 */
function stripMarkdown(text) {
	let processedText = text.replace(mdUrlRegEx, '$1');
	let ulElements = processedText.match(mdLiRegEx).map((element) => {
		return element.replace(mdLiRegEx, '$1');
	});

	return ulElements.join('\n');
}

/**
 * Reformat date in string format to DD-MM-YYYY format.
 * @param  {String} dateString Date in ISO8601 format
 * @return {String} String in DD-MM-YYYY format
 */
function reformatDate(dateString) {
	let date = new Date(dateString);
	return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

main().catch((err) => {
	console.log(`Error: ${err.message}`);
	process.exit(1);
});
