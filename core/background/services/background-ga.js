'use strict';

/**
 * Includes Universal Analytics tracking code and provides method for sending data
 *
 * Does not track anything automatically
 */
define(function() {

	// formatted GA isogram
	(function(i, s, o, g, r, a, m) {
		i.GoogleAnalyticsObject = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments);
		};
		i[r].l = 1 * new Date();
		a = s.createElement(o);
		m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m);
	})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

	window.ga('create', 'UA-16968457-1', 'auto');
	window.ga('set', 'checkProtocolTask', function(){});

	/**
	 * @param {...*}
	 */
	function send() {
		if (localStorage.disableGa === '1') {
			return;
		}

		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift('send');
		window.ga.apply(window, args);
	}

	/**
	 * @param {...*}
	 */
	function event() {
		if (localStorage.disableGa === '1') {
			return;
		}

		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift('event');
		send.apply(window, args);
	}

	return {
		send: send,
		event: event
	};
});
