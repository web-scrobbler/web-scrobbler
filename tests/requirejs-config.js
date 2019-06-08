'use strict';

require('node-define').config({
	paths: {
		connectors: 'src/core/connectors',
		wrapper: 'tests/stubs',
		storage: 'src/core/background/storage',
		vendor: 'src/vendor',

		'webextension-polyfill': 'tests/stubs/webextension-polyfill',
		'object/deep-proxy': 'src/core/background/object/deep-proxy',
		'util/util': 'src/core/background/util/util'
	},
	waitSeconds: 0
});
