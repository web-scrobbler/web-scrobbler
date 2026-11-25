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

export enum Category {
	// Fallback value in case when we cannot fetch a category.
	Unknown = 'YT_DUMMY_CATEGORY_UNKNOWN',
	Music = 'Music',
	Entertainment = 'Entertainment',
}

export async function ytWatchRequest(videoId: string) {
	const watchHtmlText = await fetchWatchHtmlText(videoId);

	const category =
		watchHtmlText.match(/"category":"(.+?)"/)?.[1] ?? Category.Unknown;

	const retval = {
		category,
	};

	Util.debugLog(`ytWatch(${videoId}): ${JSON.stringify(retval, null, 4)}`);

	return retval;
}
