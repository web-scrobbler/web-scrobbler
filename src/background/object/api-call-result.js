export default class ApiCallResult {
	/**
	 * @constructor
	 *
	 * @param {String} resultType Result type
	 * @param {String} scrobblerId Scrobbler ID
	 */
	constructor(resultType, scrobblerId) {
		if (!ApiCallResult.SUPPORTED_TYPES.includes(resultType)) {
			throw new TypeError(`Unknown result type: ${resultType}`);
		}

		this.type = resultType;
		this.scrobblerId = scrobblerId;

		this.contextInfo = null;
	}

	/**
	 * Get an ID of a scrobbler that created the result.
	 *
	 * @return {String} Scrobbler ID
	 */
	getScrobblerId() {
		return this.scrobblerId;
	}

	/**
	 * Get an additional information related to the result.
	 *
	 * @return {Object} Context info
	 */
	getContextInfo() {
		return this.contextInfo;
	}

	/**
	 * Check if a given result type equals the type of this result object.
	 *
	 * @param {String} resultType Type to check
	 *
	 * @return {Boolean} Check result
	 */
	is(resultType) {
		return this.type === resultType;
	}

	/**
	 * Set an additional information related to the result.
	 *
	 * @param {Object} contextInfo Context info
	 */
	setContextInfo(contextInfo) {
		this.contextInfo = contextInfo;
	}

	/**
	 * Successfull result.
	 */
	static get RESULT_OK() {
		return 'ok';
	}

	/**
	 * Song is ignored by scrobbling service.
	 */
	static get RESULT_IGNORE() {
		return 'ignored';
	}

	/**
	 * Authorization error.
	 */
	static get ERROR_AUTH() {
		return 'error-auth';
	}

	/**
	 * Another error.
	 */
	static get ERROR_OTHER() {
		return 'error-other';
	}

	/**
	 * Return a list of supported result types.
	 */
	static get SUPPORTED_TYPES() {
		return [
			ApiCallResult.RESULT_OK,
			ApiCallResult.RESULT_IGNORE,
			ApiCallResult.ERROR_AUTH,
			ApiCallResult.ERROR_OTHER,
		];
	}
}
