# Contributing

First of all, thanks for taking the time to contribute to Web Scrobbler!

## Did you find a bug

-   Ensure the bug was not already reported by searching on GitHub under issues.
-   If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible.

Please read [this page][1] to understand how to get the extension logs. If you don't know how to report bugs effectively, please use [this article][2] as a guideline.

## Did you write a patch that fixes a bug or adds new functionality?

-   Read [Our Wiki][8]
-   Fork the Web Scrobbler [git repository][9]
-   Create a Pull Request against the [**master**][10] branch
-   Ensure the PR description **clearly** describes the problem and solution. Include the relevant issue number(s) if applicable.
-   Ensure CI tests pass

It's also worth reading [how to write][3] good commit messages.

### Coding conventions

We use a number of linters to verify the source code. Please ensure before committing the changes they meet our requirements by running `grunt lint`. If you're not familiar with Grunt, please read [this article][4].

We also use EditorConfig, which helps to keep code in the same code style in different code editors and IDE's. If you haven't use EditorConfig before, you can visit [EditorConfig website][5] for further information.

### Connectors development

Connectors development is explained in [this][6] and [this][7] articles.

[1]: https://github.com/web-scrobbler/web-scrobbler/wiki/Debug-the-extension

[2]: http://www.chiark.greenend.org.uk/~sgtatham/bugs.html

[3]: http://chris.beams.io/posts/git-commit/

[4]: http://gruntjs.com/getting-started

[5]: http://editorconfig.org/#overview

[6]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development

[7]: https://github.com/web-scrobbler/web-scrobbler/wiki/Setup-development-environment

[8]: https://github.com/web-scrobbler/web-scrobbler/wiki

[9]: https://github.com/web-scrobbler/web-scrobbler

[10]: https://github.com/web-scrobbler/web-scrobbler/tree/master
