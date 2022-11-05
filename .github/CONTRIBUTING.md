# Contributing

First of all, thanks for taking the time to contribute to Web Scrobbler!

If you want to contribute to a `metadata-filter` module, which is used to
filter track info in this extension, follow [this link][MfRepository].

If you find an issue on the extension website, please, submit it
to a [relevant repository][WebsiteRepository].

## Translating the extension

Follow this [wiki page][TranslateHowto] for details.

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
-   Ensure PR title explains **concicely** what the functionality is doing.
-   Ensure the PR description **clearly** describes the problem and solution.
Include the relevant issue number(s) if applicable.
-   Ensure CI tests pass.

It's also worth reading [how to write][CommitMessages] good commit messages.

### Submitting rules

Please open a separate PR for each *logical* addition, change, or deletion.
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
committing the changes they meet our requirements by running `grunt lint`.
If you're not familiar with Grunt, please read [this article][Grunt].

We also use EditorConfig, which helps to keep code in the same code style
in different code editors and IDE's. If you haven't used EditorConfig before,
you can visit [EditorConfig website][EditorConfig] for further information.

[CommitMessages]: http://chris.beams.io/posts/git-commit/
[ConnectorsDev]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
[Discord-Server]: https://discord.com/invite/u99wNWw
[DebugExtension]: https://github.com/web-scrobbler/web-scrobbler/wiki/Debug-the-extension
[EditorConfig]: http://editorconfig.org/#overview
[Grunt]: http://gruntjs.com/getting-started
[ReportBugs]: http://www.chiark.greenend.org.uk/~sgtatham/bugs.html
[SetupDevEnv]: https://github.com/web-scrobbler/web-scrobbler/wiki/Setup-development-environment
[TranslateHowto]: https://github.com/web-scrobbler/web-scrobbler/wiki/Translate-the-extension
[Wiki]: https://github.com/web-scrobbler/web-scrobbler/wiki

[MfRepository]: https://github.com/web-scrobbler/metadata-filter
[RepositoryMaster]: https://github.com/web-scrobbler/web-scrobbler/tree/master
[Repository]: https://github.com/web-scrobbler/web-scrobbler
[WebsiteRepository]: https://github.com/web-scrobbler/web-scrobbler.github.io
