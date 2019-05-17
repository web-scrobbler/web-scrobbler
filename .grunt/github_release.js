'use strict';

/**
 * Grunt task to create new release on GitHub.
 */

const Octokit = require('@octokit/rest');

const owner = 'web-scrobbler';
const repo = 'web-scrobbler';

let githubClient = {};

module.exports = (grunt) => {
	grunt.registerTask('github_release', 'Create a release on GitHub', async function() {
		let done = this.async();
		let data = grunt.config.get(this.name);
		let tagName = `v${data.version}`;

		githubClient = new Octokit({
			auth() {
				return `token ${data.token}`;
			}
		});

		try {
			await publishRelease(tagName);
			grunt.log.ok(`Created release for ${tagName} version`);
		} catch (err) {
			grunt.log.error(err.message);
		} finally {
			done();
		}
	});
};

/**
 * Publish release on GitHub.
 * Find previously created draft release and make it as published one.
 *
 * @param  {String} tagName Git tag
 */
async function publishRelease(tagName) {
	let release = await getReleaseByName(tagName);
	if (!release.draft) {
		throw new Error(`Unable to create release: ${tagName} is not a draft release`);
	}

	await githubClient.repos.updateRelease({
		owner, repo,

		draft: false,
		tag_name: tagName,
		release_id: release.id,
	});
}

/**
 * Get release by git tag.
 * @param  {String} tagName Git tag
 * @return {Promise} Promise resolved with release object
 */
async function getReleaseByName(tagName) {
	let response = await githubClient.repos.listReleases({ owner, repo });
	if (!response) {
		throw new Error(`${owner}/${repo} has no releases`);
	}

	let releases = response.data;
	for (let release of releases) {
		// Drafts have no `tag` property
		if (release.name === tagName) {
			return release;
		}
	}

	throw new Error(`${owner}/${repo} has no ${tagName} release`);
}
