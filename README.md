# Vector Replace (Extension of Visual Studio Code)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub Actions: main](https://img.shields.io/github/workflow/status/tana-gh/vector-replace/main.svg?logo=github)](https://github.com/tana-gh/vector-replace/actions)

Vector Replace is extension of Visual Studio Code for replacing multiple words.

![window-searched](https://tana-gh.github.io/vector-replace-media/window-searched.png)

![window-replaced](https://tana-gh.github.io/vector-replace-media/window-replaced.png)

## Features

Open the text editor, you will see the navigation menu of Vector Replace on top left. Click this menu icon to open a view of the search and replace settings.

![window-navigation](https://tana-gh.github.io/vector-replace-media/window-navigation.png)

Enter search and replace text and click the "Replace" button, then text will be replaced on the active text editor.

![window-view](https://tana-gh.github.io/vector-replace-media/window-view.png)

In this extension, search text and replace text are specified multiple per line. See the following image:

![window-abc](https://tana-gh.github.io/vector-replace-media/window-abc.png)

If you specify like this in the search pane, 'a' is searched at first, 'b' is searched next, and 'c' is searched at last. Further, if you specify as above in the replace pane, 'a' will be replaced by 'd', 'b' will be replaced by 'e', and 'c' will be replaced by 'f'.

## Settings

### Use regular expression

If checking this, can use regular expression in the search pane. Also, can use the capturing replace by using '$'.

### Ignore case search

If checking this, can be ignored upper/lower case when searching.

### Ignore bang search

If checking this, can be ignored rows that start with '!' in the search pane. If you want to search for '!' itself, start with '!!'.

### Ignore bang replace

If checking this, can be ignored rows that start with '!' in the replace pane. If you want to replace for '!' itself, start with '!!'.

### Ignore empty search

This check cannot be changed. In the search pane, empty rows are ignored.

### Ignore empty replace

If checking this, can be ignored empty rows in the replace pane.

### Loop search

If checking this, search strings are looped. When a search string reaches to the end, and returns to the beginning of search strings.

### Loop replace

If checking this, replace strings are looped. When a replace string reaches to the end, and returns to the beginning of replace strings.

### Just search

If checking this, the search will not be match when only matches until a part of all search strings. For example, loop search is enabled and search strings are 'a', 'b', 'c', then 'abcab' is matched by only 'abc'.

---

## Release Notes

### 1.0.0

Initial release.
