'use strict';

/**
 * Grunt task to dump GitHub changelog into a file.
 */

const fs = require('fs');
const path = require('path');

const GitHubApi = require('github');

const CONTENT_DIRECTORY = '.add0n';
const CHANGELOG_DATA_FILENAME = 'changelog.json';

const mdUrlRegEx = /\[(.+?)\]\(.+?\)/g; // [desc](URL)
const mdLiRegEx = /\*\s(.+)/g; // * Text

const github = new GitHubApi();

module.exports = (grunt) => {
	grunt.registerTask('dump_changelog', 'Dump changelog to a file', function() {
		let done = this.async();
		let data = grunt.config.get(this.name);

		github.authenticate({ type: 'token', token: data.token });

		getChangelog(data.version).then((changelog) => {
			saveChangelog(changelog);

			grunt.log.write(`Updated changelog for ${data.version} release`);
			done();
		}).catch((err) => {
			grunt.log.error(err);
			done();
		});
	});
};

/**
 * Get changelog object that is used on add0n.com website.
 * @param  {String} version Release version
 * @return {Promise} Promise resolved with changelog object
 */
function getChangelog(version) {
	let tagName = `v${version}`;

	return getRelease(tagName).then((release) => {
		let changelog = stripMarkdown(release.body);
		let created = release.published_at;

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
 * Get release by git tag.
 * @param  {String} tagName Git tag
 * @return {Promise} Promise resolved with release object
 */
function getRelease(tagName) {
	return github.repos.getReleases({
		owner: 'david-sabata', repo: 'web-scrobbler'
	}).then((response) => {
		let releases = response.data;
		for (let release of releases) {
			if (release.tag_name === tagName) {
				return release;
			}
		}

		throw new Error(`Unknown release: ${tagName}`);
	});
}

/**
 * Dump changelog object into file.
 * @param  {Object} changelog Changelog object
 */
function saveChangelog(changelog) {
	let filepath = path.join(CONTENT_DIRECTORY, CHANGELOG_DATA_FILENAME);
	let changelogData = `${JSON.stringify(changelog, null, 2)}\n`;

	fs.writeFileSync(filepath, changelogData);
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
