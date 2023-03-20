export enum ServiceCallResult {
	// Successful result
	RESULT_OK = 'ok',
	// Song is ignored by scrobbling service
	RESULT_IGNORE = 'ignored',
	// Authorization error
	ERROR_AUTH = 'error-auth',
	// Another error
	ERROR_OTHER = 'error-other',
}
