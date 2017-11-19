'use strict';

/**
 * Grunt task to create new release on GitHub.
 */

const GitHubApi = require('github');

const github = new GitHubApi();

module.exports = (grunt) => {
	grunt.registerTask('github_publish', 'Create a release on GitHub', function() {
		let done = this.async();
		let data = grunt.config.get(this.name);
		let tagName = `v${data.version}`;

		github.authenticate({ type: 'token', token: data.token });

		publishRelease(tagName).then(() => {
			grunt.log.ok(`Created release for ${tagName} version`);
			done();
		}).catch((err) => {
			grunt.log.error(err);
			done();
		});
	});
};

/**
 * Publish release on GitHub. *
 * Find previously created draft release and make it as published one.
 *
 * @param  {String} tagName Git tag
 * @return {Promise} Promise resolved then the task has complete
 */
function publishRelease(tagName) {
	return getRelease(tagName).then((release) => {
		if (!release.draft) {
			throw new Error(`Unable to create release: ${tagName} is not a draft release`);
		}

		return github.repos.editRelease({
			owner: 'david-sabata',
			repo: 'web-scrobbler',
			id: release.id,
			tag_name: tagName
		});
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
			// Drafts have no `tag` property
			if (release.name === tagName) {
				return release;
			}
		}

		throw new Error(`Unknown release: ${tagName}`);
	});
}
