'use strict';

const fs = require('fs');
const deploy = require('firefox-extension-deploy');

module.exports = (grunt) => {
	grunt.registerTask('amo_upload', 'Upload an extension to AMO', function() {
		let data = grunt.config.get(this.name);
		data.src = fs.createReadStream(data.src);

		let done = this.async();
		deploy(data).then(() => {
			grunt.log.ok('Uploaded successfully.');
			done();
		}).catch((err) => {
			grunt.log.error(err);
			done();
		});
	});
};
