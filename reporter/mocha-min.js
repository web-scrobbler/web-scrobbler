const { reporters, Runner } = require('mocha');

const { EVENT_RUN_END } = Runner.constants;

/**
 * Custom min reporter for Mocha.
 *
 * This reporter does not clear console.
 */

exports = module.exports = class Min extends reporters.Base {
	constructor(runner) {
		super(runner);

		runner.once(EVENT_RUN_END, () => {
			this.epilogue();
		});
	}

	static get description() {
		return 'custom min reporter';
	}
};
