'use strict';

require('node-define').config({
	paths: {
		connectors: 'src/core/connectors',
		wrapper: 'tests/stubs',
		storage: 'src/core/background/storage',
		object: 'src/core/background/object',
		vendor: 'src/vendor',
		md5: 'src/vendor/md5.min',

		'webextension-polyfill': 'tests/stubs/webextension-polyfill',
		'util/util': 'src/core/background/util/util',
	},
	waitSeconds: 0,
});
