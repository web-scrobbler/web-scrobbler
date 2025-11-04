# Contributing

First of all, thanks for taking the time to contribute to Web Scrobbler!

If you want to contribute to a `metadata-filter` module, which is used to
filter track info in this extension, follow [this link][MfRepository].

If you find an issue on the extension website, please, submit it
to a [relevant repository][WebsiteRepository].

## Translating the extension

Follow the [Translation wiki][TranslateHowto] for details.

## Submitting issues

-   Ensure the bug was not already reported by searching on GitHub under issues.
-   If you're unable to find an open issue addressing the problem, open
    a new one. Be sure to include a title and clear description, as much relevant
    information as possible.

Please read [this page][DebugExtension] to understand how to get
the extension logs. If you don't know how to report bugs effectively,
please use [this article][ReportBugs] as a guideline.

### Submitting rules

Please make sure your issue describes only one feature, request or bug.

## Submitting pull requests

-   Read [our wiki][Wiki].
-   Fork the Web Scrobbler [git repository][Repository].
-   Create a pull request against the [**master**][RepositoryMaster] branch.
-   Ensure PR title explains **concisely** what the functionality is doing, if merged this will be used in the release notes.
-   Ensure the PR description **clearly** describes the problem and solution.
    Include the relevant issue number(s) if applicable.
-   Ensure CI tests pass.

It's also worth reading [how to write][CommitMessages] good commit messages.

### PR title guidelines

Since PR titles are used to communicate changes in the release notes we should strive for consistency.

For example when adding support for a new connector the title should be:

```
Add support for Soundcloud
```

If your fixing a connector:

```
Fix Soundcloud connector
```

For fixes and general updates they should express the change concisely. Examples:

-   Improve artist filters for Soundcloud connector
-   Update dark mode colour scheme
-   Fix race condition when scrobbling cached entries

### Submitting rules

Please open a separate PR for each _logical_ addition, change, or deletion.
For example, if you added a new connector, and fixed an existing one, open
two separate PRs for each change; if you added a new feature and updated
connectors to use this feature, you can open a single PR containing all changes.

This is because we leverage tooling to automate the release notes and uses the
PR title and labels to organise this correctly.

If you plan on contributing something that requires significant changes, please
contact us first. You can find us in [Discord][Discord-Server]; alternatively,
feel free to open a new issue or discussion and tell us about your plans.

### Setup environment

Follow [this][SetupDevEnv] wiki page for details.

### Connectors development

Connectors development is explained in [this][ConnectorsDev].

### Coding conventions

We use a number of linters to verify the source code. Please ensure before
committing the changes they meet our requirements by running `npm run lint`.

We also use EditorConfig, which helps to keep code in the same code style
in different code editors and IDE's. If you haven't used EditorConfig before,
you can visit [EditorConfig website][EditorConfig] for further information.

[CommitMessages]: http://chris.beams.io/posts/git-commit/
[ConnectorsDev]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
[Discord-Server]: https://discord.com/invite/u99wNWw
[DebugExtension]: https://github.com/web-scrobbler/web-scrobbler/wiki/Debug-the-extension
[EditorConfig]: http://editorconfig.org/#overview
[ReportBugs]: http://www.chiark.greenend.org.uk/~sgtatham/bugs.html
[SetupDevEnv]: https://github.com/web-scrobbler/web-scrobbler/wiki/Setup-development-environment
[TranslateHowto]: https://github.com/web-scrobbler/web-scrobbler/wiki/Translate-the-extension
[Wiki]: https://github.com/web-scrobbler/web-scrobbler/wiki
[MfRepository]: https://github.com/web-scrobbler/metadata-filter
[RepositoryMaster]: https://github.com/web-scrobbler/web-scrobbler/tree/master
[Repository]: https://github.com/web-scrobbler/web-scrobbler
[WebsiteRepository]: https://github.com/web-scrobbler/web-scrobbler.github.io
