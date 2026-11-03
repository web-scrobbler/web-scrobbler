<div align="center">

<p>
	<img width="128" src="./src/icons/main/universal.svg"/>
</p>
<h1>Web Scrobbler</h1>

[![Chrome Web Store][WebStoreBadge]][WebStore]
[![Addons.mozilla.org][AmoBadge]][Amo]
[![iTunes App Store][AppleStoreBadge]][AppleStore]
[![Microsoft Edge Addons][EdgeBadge]][Edge]

[![Discord][DiscordBadge]][Discord]
[![Test status][GitHubActionsBadge]][GitHubActions]
[![Codacy Badge][CodacyBadge]][Codacy]
[![Codacy Coverage Badge][CodacyCoverageBadge]][Codacy]
[![Crowdin Badge][CrowdinBadge]][Crowdin]

</div>

Web Scrobbler helps online music listeners to scrobble their playback history.

## Supported Services

-   [Last.fm][LastFm]
-   [Libre.fm][LibreFm]
-   [ListenBrainz][ListenBrainz]
-   [Maloja][Maloja]
-   [Pleroma][Pleroma]

## Installation

The extension can be either downloaded from stores, or installed as an [unpacked extension][DocsUnpacked].

### Chrome Web Store

It can be installed directly from the [Chrome Web Store][WebStore] for Chrome users.

Opera users can install the extension from Chrome Web Store using the
[Download Chrome Extension][DownloadChromeExt] addon for Opera.

### Addons.mozilla.org

For those who prefer Firefox, the extension is available on [Addons.mozilla.org][Amo].

### Safari

The extension is also available in the [Apple Store][AppleStore].


### Microsoft Edge Add-ons

The extension is also available on the [Microsoft Edge Add-ons][Edge].

### Install from source code

To install the extension from sources or zip file, read
[this page][WikiUnpacked] if you're on Chrome, or [this one][WikiTempAddon]
if you use Firefox.

For local Chrome Web Store and Opera updates, see
[updating without losing settings or cache](docs/youtube-background-scrobbling.md#updating-a-local-build-in-chrome-or-opera).
Use **Load unpacked** with the built `build/chrome` folder. The Chromium build
includes the public key for the Chrome Web Store extension ID, so it can use
the existing extension's storage.

## Development

### Build the extension

Before building the extension you should install dependencies:

```sh
# Install dependencies
> npm ci

# Build the extension
> npm run dist firefox
# or
> npm run dist chrome
# or (requires Xcode (xcrun and xcodebuild))
> npm run dist safari
```

The built extension is available in the browser's subdirectory of `build`, such
as `build/chrome` or `build/firefox`. You can load that directory as an unpacked
extension. Chromium distribution builds also produce `web-scrobbler-chrome.zip`.

The detailed build instruction is available [here][BuildInstructions].

### YouTube background playback

Version 3.23.2 fixes YouTube videos opened paused in a background tab being saved
as disallowed scrobbles after playback starts. Playback timing now follows the
video element, and eligible plays recover after a temporary block clears. See
the [troubleshooting and verification notes](docs/youtube-background-scrobbling.md).

### Develop connectors

Check the [wiki page][WikiDev] to understand development of connectors. Please
also read our [contribution guidelines][Contributing].

### Translations

Follow the [Translation wiki][Translations] for details.

## Media

Follow [@web_scrobbler][Twitter] on Twitter to receive the latest news and updates.

Join the [Discord channel][Discord] to discuss the extension.

## Privacy Policy

See the [privacy policy][Privacy].

## License

Licensed under the [MIT License][License].

<!-- Badges -->

[CrowdinBadge]: https://badges.crowdin.net/web-scrobbler-test/localized.svg
[AmoBadge]: https://img.shields.io/amo/v/web-scrobbler.svg?label=firefox&logo=firefox-browser&logoColor=white
[CodacyBadge]: https://app.codacy.com/project/badge/Grade/ab1b7aac4f4f4f0d84a2ff3906be05cf
[CodacyCoverageBadge]: https://app.codacy.com/project/badge/Coverage/ab1b7aac4f4f4f0d84a2ff3906be05cf
[DiscordBadge]: https://img.shields.io/discord/716363971070001202?logo=discord&logoColor=white&color=7289dA
[EdgeBadge]: https://img.shields.io/badge/dynamic/json?label=edge&logo=microsoft-edge&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fobiekdelmkmlgnhddmmnpnfhngejbnnc
[GitHubActionsBadge]: https://img.shields.io/github/actions/workflow/status/web-scrobbler/web-scrobbler/test.yml
[WebStoreBadge]: https://img.shields.io/chrome-web-store/v/hhinaapppaileiechjoiifaancjggfjm.svg?label=chrome&logo=google-chrome&logoColor=white
[AppleStoreBadge]: https://img.shields.io/itunes/v/6449224218?label=safari&logo=apple&logoColor=white

<!-- Docs -->

[BuildInstructions]: https://github.com/web-scrobbler/web-scrobbler/wiki/Setup-development-environment
[Contributing]: https://github.com/web-scrobbler/web-scrobbler/blob/master/.github/CONTRIBUTING.md
[DocsUnpacked]: https://developer.chrome.com/extensions/getstarted#unpacked
[License]: https://github.com/web-scrobbler/web-scrobbler/blob/master/LICENSE.md
[Privacy]: https://github.com/web-scrobbler/web-scrobbler/blob/master/src/_locales/en/privacy.md
[Translations]: https://github.com/web-scrobbler/web-scrobbler/wiki/Translate-the-extension

<!-- Download -->

[Amo]: https://addons.mozilla.org/en-US/firefox/addon/web-scrobbler/
[Edge]: https://microsoftedge.microsoft.com/addons/detail/web-scrobbler/obiekdelmkmlgnhddmmnpnfhngejbnnc
[WebStore]: https://chrome.google.com/webstore/detail/lastfm-scrobbler/hhinaapppaileiechjoiifaancjggfjm
[AppleStore]: https://apps.apple.com/app/web-scrobbler/id6449224218

<!-- Other -->

[DownloadChromeExt]: https://addons.opera.com/extensions/details/app_id/kipjbhgniklcnglfaldilecjomjaddfi

<!-- Related pages -->

[Codacy]: https://app.codacy.com/gh/web-scrobbler/web-scrobbler/dashboard
[Discord]: https://discord.com/invite/u99wNWw
[GitHubActions]: https://github.com/web-scrobbler/web-scrobbler/actions
[Twitter]: https://twitter.com/web_scrobbler
[Crowdin]: https://crowdin.com/project/web-scrobbler-test

<!-- Services -->

[LastFm]: http://www.last.fm/
[LibreFm]: https://libre.fm/
[ListenBrainz]: https://listenbrainz.org/
[Maloja]: https://github.com/krateng/maloja
[Pleroma]: https://pleroma.social/

<!-- Wiki pages -->

[WikiDev]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
[WikiTempAddon]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-a-temporary-add-on
[WikiUnpacked]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-an-unpacked-extension
