enum State {
	Waiting = 'WAITING',
	Rejected = 'REJECTED',
	Accepted = 'ACCEPTED',
	Confirmed = 'CONFIRMED',
}

declare interface Window {
	wsState: () => State;
	setWSState: (newState: State) => void;
}

setInterval(() => {
	if ((window as Window).wsState() === State.Accepted) {
		const search = new URLSearchParams(window.location.search);
		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'confirmLogin',
				applicationName: search.get('applicationName'),
				userApiUrl: search.get('userApiUrl'),
			},
			'*',
		);
		(window as Window).setWSState(State.Confirmed);
	}
}, 1000);
