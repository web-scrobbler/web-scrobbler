async function fetchWatchHtmlText(videoId: string) {
	/*
	 * We cannot use `location.href`, since it could miss the video URL
	 * in case when YouTube mini player is visible.
	 */
	const videoUrl = `${location.origin}/watch?v=${videoId}`;
	const response = await fetch(videoUrl);
	const rawHtml = await response.text();
	return rawHtml;
}

// RFC 8259
function findJsonStringEnd(jsonString: string): number {
	let index = 0;

	// #v-ifdef VITE_DEV
	function assert(cond: boolean, desc: string) {
		console.assert(cond, desc);
		if (!cond) {
			// eslint-disable-next-line no-debugger
			debugger;
		}
	}
	// #v-endif

	function skipWhitespace() {
		while ([' ', '\t', '\n', '\r'].includes(jsonString.charAt(index))) {
			index++;
		}
	}

	function skipString() {
		// #v-ifdef VITE_DEV
		assert(jsonString.charAt(index) === '"', 'string-start');
		// #v-endif
		index++; // '"'
		outer: while (index < jsonString.length) {
			switch (jsonString.charAt(index++)) {
				case '\\':
					index++;
					break;
				case '"':
					break outer;
			}
		}
	}

	function skipObject() {
		// #v-ifdef VITE_DEV
		assert(jsonString.charAt(index) === '{', 'object-brace');
		// #v-endif
		index++; // begin-object
		if (jsonString.charAt(index) === '}') {
			index++; // end-object
			return;
		}
		while (index < jsonString.length) {
			skipWhitespace();
			skipString(); // string
			skipWhitespace();
			// #v-ifdef VITE_DEV
			assert(jsonString.charAt(index) === ':', 'object-colon');
			// #v-endif
			index++; // name-separator
			skipWhitespace();
			skipJsonNode(); // value
			skipWhitespace();
			if (jsonString.charAt(index) === '}') {
				index++; // end-object
				break;
			}
			// #v-ifdef VITE_DEV
			assert(jsonString.charAt(index) === ',', 'object-comma');
			// #v-endif
			index++; // value-separator
		}
	}

	function skipArray() {
		// #v-ifdef VITE_DEV
		assert(jsonString.charAt(index) === '[', 'array-brace');
		// #v-endif
		index++; // begin-array
		if (jsonString.charAt(index) === ']') {
			index++; // end-array
			return;
		}
		while (index < jsonString.length) {
			skipWhitespace();
			skipJsonNode();
			skipWhitespace();
			if (jsonString.charAt(index) === ']') {
				index++; // end-array
				break;
			}
			// #v-ifdef VITE_DEV
			assert(jsonString.charAt(index) === ',', 'array-comma');
			// #v-endif
			index++; // value-separator
		}
	}

	function skipDigits(minOne: boolean) {
		const start = index;
		while (index < jsonString.length) {
			switch (jsonString.charAt(index)) {
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					index++;
					continue;
			}
			break;
		}
		// #v-ifdef VITE_DEV
		assert(!minOne || start !== index, 'zero-digits');
		// #v-endif
	}

	function skipNumber() {
		if (jsonString.charAt(index) === '-') {
			index++; // minus
		}
		skipDigits(false); // int
		if (jsonString.charAt(index) === '.') {
			// frac
			index++; // decimal-point
			skipDigits(true);
		}
		if (jsonString.charAt(index) === 'e') {
			// exp
			index++; // e
			switch (jsonString.charAt(index)) {
				case '-': // minus
				case '+': // plus
					index++;
			}
			skipDigits(true);
		}
	}

	function skipJsonNode() {
		switch (jsonString.charAt(index)) {
			case 't': // true
				// #v-ifdef VITE_DEV
				assert(jsonString.slice(index, index + 4) === 'true', 'true');
				// #v-endif
				index += 4;
				break;
			case 'n': // null
				// #v-ifdef VITE_DEV
				assert(jsonString.slice(index, index + 4) === 'null', 'null');
				// #v-endif
				index += 4;
				break;
			case 'f': // false
				// #v-ifdef VITE_DEV
				assert(jsonString.slice(index, index + 5) === 'false', 'null');
				// #v-endif
				index += 5;
				break;
			case '"': // string
				skipString();
				break;
			case '{': // object
				skipObject();
				break;
			case '[': // array
				skipArray();
				break;
			default: // number
				skipNumber();
				break;
		}
	}

	skipWhitespace();
	skipJsonNode();
	return index;
}

function parseFrom(startRegExp: RegExp, htmlText: string) {
	const startMatch = startRegExp.exec(htmlText);
	if (!startMatch) {
		return {};
	}
	const jsonStart = startMatch.index + startMatch[0].length;
	const jsonLen = findJsonStringEnd(htmlText.slice(jsonStart));
	const jsonText = htmlText.slice(jsonStart, jsonStart + jsonLen);
	return JSON.parse(jsonText);
}

// function extractInitialPlayerResponse(
// 	htmlText: string,
// ): YtWatchInitialPlayerResponse {
// 	const startRegExp = /var\s+ytInitialPlayerResponse\s*=\s*/;
// 	return parseFrom(startRegExp, htmlText);
// }

// function extractInitialData(htmlText: string): YtWatchInitialData {
// 	const startRegExp = /var\s+ytInitialData\s*=\s*/;
// 	return parseFrom(startRegExp, htmlText);
// }

export enum Category {
	// Fallback value in case when we cannot fetch a category.
	Unknown = 'YT_DUMMY_CATEGORY_UNKNOWN',
	Music = 'Music',
	Entertainment = 'Entertainment',
}

export async function ytWatchRequest(videoId: string) {
	const watchHtmlText = await fetchWatchHtmlText(videoId);
	// const initialPlayerResponse = extractInitialPlayerResponse(watchHtmlText);
	// const initialPlayerData = extractInitialData(watchHtmlText);

	const category =
		watchHtmlText.match(/"category":"(.+?)"/)?.[1] ?? Category.Unknown;

	const retval = {
		category,
	};

	Util.debugLog(`ytWatch(${videoId}): ${JSON.stringify(retval, null, 4)}`);

	return retval;
}
