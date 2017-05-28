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

const mdUrlRegEx = /\[(.+?)\]\(.+?\)/g; // [desc](URL)
const mdLiRegEx = /\*\s(.+)/g; // * Text

const RELEASE_COUNT = 3;

/**
 * Entry point.
 * @return {Promise} Promise that will be resolved when the task has complete
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
	return github.repos.getReleases({
		owner: 'david-sabata', repo: 'web-scrobbler'
	}).then((response) => {
		let changelogObject = { results: [] };
		let releases = response.data.sort((a, b) => {
			return a.published_at.localeCompare(b.published_at);
		}).reverse().slice(0, RELEASE_COUNT);

		for (let release of releases) {
			let changelog = stripMarkdown(release.body);
			let version = release.tag_name.substring(1); // skip "v" prefix
			let created = release.published_at;

			changelogObject.results.push({
				release_notes: {
					'en-US': changelog
				},
				files: [{
					created
				}],
				version
			});
		}

		return changelogObject;
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

main().catch((err) => {
	console.log(`Error: ${err.message}`);
	process.exit(1);
});
