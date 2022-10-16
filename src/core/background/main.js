'use strict';

/**
 * Background script entry point.
 */
require(['extension', 'util/migrate'], (...modules) => {
	const [Extension, Migrate] = modules;

	Migrate.migrate().then(() => {
		console.log("LINE 10");
		new Extension().start();
	});
});
