'use strict';

require('node-define');

const ROOT_DIR = '..';

const connectors = require(`${ROOT_DIR}/src/core/connectors.js`);
const CONNECTORS_LIST_FILE = 'media/connectors.json';

module.exports = (grunt) => {
	grunt.registerTask('dump_connectors', 'Dump a list of connectors', function() {
		const contents = JSON.stringify(connectors, null, 2);
		grunt.file.write(CONNECTORS_LIST_FILE, contents);

		grunt.log.ok(`Dumped connectors: ${connectors.length} items`);
	});
};
