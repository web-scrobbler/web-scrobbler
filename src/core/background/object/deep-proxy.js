'use strict';

define(() => {
	/**
	 * Create proxy handler which calls callback function on property change.
	 * @param  {Object} obj Object to wrap
	 * @param  {Function} cb Function is called on property change
	 * @return {Object} Proxy handler object
	 */
	function makeHandler(obj, cb) {
		return {
			get(target, key) {
				if (typeof target[key] === 'object' && target[key] !== null) {
					return new Proxy(target[key], this);
				}

				return target[key];
			},
			set(target, key, value) {
				let prevValue = Reflect.get(target, key);
				if (prevValue !== value) {
					Reflect.set(target, key, value);
					if (typeof cb === 'function') {
						cb(obj, target, key, value);
					}
				}

				return true;
			}
		};
	}

	/**
	 * Wrap given object to proxy object.
	 * @param  {Object} obj Object to wrap
	 * @param  {Function} cb Function is called on property change
	 * @return {Proxy} Proxy object
	 */
	function wrap(obj, cb) {
		return new Proxy(obj, makeHandler(obj, cb));
	}

	return { wrap };
});
