/**
 * Reasons why a scrobble could be disallowed
 */
export type DisallowedReason =
	/**
	 * Current track is an ad
	 */
	| 'IsAd'

	/**
	 * YouTube category **the user** has disabled
	 */
	| 'ForbiddenYouTubeCategory'

	/**
	 * Artist/album/track tag **the user** has disabled
	 * For tags that are always disabled in the connector, use 'FilteredTag'
	 */
	| 'ForbiddenTag'

	/**
	 * Playing from a channel **the user** has disabled
	 */
	| 'ForbiddenChannel'

	/**
	 * Not recognized as music by YTM despite user setting demanding it
	 */
	| 'NotOnYouTubeMusic'

	/**
	 * Web scrobbler thinks this song is playing on a different device
	 */
	| 'IsPlayingElsewhere'

	/**
	 * Some element web scrobbler relies on is missing
	 */
	| 'ElementMissing'

	/**
	 * Tags contain some term that is filtered **on website**
	 * For tags disabled by the user, use 'ForbiddenTag'
	 */
	| 'FilteredTag'

	/**
	 * Something crucial to detection is still loading
	 * This error will normally be temporary, usually pretty quickly resolved
	 */
	| 'IsLoading'

	/**
	 * Any other reason
	 */
	| 'Other';
