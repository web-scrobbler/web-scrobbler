// FAIL LOUDLY on unhandled promise rejections / errors
process.on('unhandledRejection', (reason) => {
	console.log(reason);
	console.trace('FAILED TO HANDLE PROMISE REJECTION');
	process.exit(1);
});
