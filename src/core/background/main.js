'use strict';

/**
 * Background script entry point.
 */
require(['extension', 'util/migrate'], (...modules) => {
	const [Extension, Migrate] = modules;

	Migrate.migrate().then(() => {
		new Extension().start();
	});
});
