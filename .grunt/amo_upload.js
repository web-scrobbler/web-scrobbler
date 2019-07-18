'use strict';

const fs = require('fs');
const deploy = require('firefox-extension-deploy');

module.exports = (grunt) => {
	grunt.registerTask('amo_upload', 'Upload an extension to AMO', async function() {
		const data = grunt.config.get(this.name);
		data.src = fs.createReadStream(data.src);

		const done = this.async();
		try {
			await deploy(data);
			grunt.log.ok('Uploaded successfully.');
		} catch (err) {
			grunt.log.error(err);
		} finally {
			done();
		}
	});
};
