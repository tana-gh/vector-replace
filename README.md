# Vector Replace (Extension of Visual Studio Code)

[![GitHub package.json version](https://img.shields.io/github/package-json/v/tana-gh/giewer.svg)](VERSION)
[![GitHub](https://img.shields.io/github/license/tana-gh/giewer.svg)](LICENSE)
[![GitHub Actions: main](https://img.shields.io/github/workflow/status/tana-gh/vector-replace/main.svg?logo=github)](https://github.com/tana-gh/vector-replace/actions)

Vector Replace is extension of Visual Studio Code for replacing multiple words.

![window-replacing](https://tana-gh.github.io/vector-replace-media/window-replacing.gif)

## Features

Open the text editor, you will see the navigation menu of Vector Replace on top left. Click this menu icon to open a view of the search and replace settings.

![window-navigation](https://tana-gh.github.io/vector-replace-media/window-navigation.png)

Enter search and replace text and click the "Replace" button, then text will be replaced on the active text editor.

![window-view](https://tana-gh.github.io/vector-replace-media/window-view.png)

In this extension, search text and replace text are specified multiple per line. See the following image:

![window-abc](https://tana-gh.github.io/vector-replace-media/window-abc.png)

If you specify like this in the search pane, 'a' is searched at first, 'b' is searched next, and 'c' is searched at last. Further, if you specify as above in the replace pane, 'a' will be replaced by 'd', 'b' will be replaced by 'e', and 'c' will be replaced by 'f'.

## Settings

### Selection search

If checking this, search and replace target are limited into selection ranges.

### Use regular expression

If checking this, can use regular expression in the search pane. Also, can use the capturing replace by using '$'.

### Capture whole

This setting can be enabled when 'Use regular expression' is enabled. If checking this, each search strings are interpreted that those are enclosed in parentheses, so always can use '$1' as whole search string on replace.

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

### Matrix search

If checking this, each search strings will be searched from all of text on the editor. Each replace strings will be corresponded to each search strings.

---

## Release Notes

### 2.0.0

Features:
- Matrix search (#6)
- Improve performance (#12)
- Progress bar (#13)

### 1.1.1

Fix bugs:
- Backslash escape sequence is not working #11

### 1.1.0

Features:
- Capture whole each search strings when regular expression is enabled #7
- Selection search #9

### 1.0.6

Fix bugs:
- When replace is done, the display of the search mark collapses for a moment #8
- Wrong behavior when 0 length string is matched #10

### 1.0.5

Update packages.

### 1.0.4

Update packages.

### 1.0.3

Fix new line searching behaviour.

### 1.0.2

Fix fatal bug that cannot responds if returns 0 length string, such as '.*'.

### 1.0.1

Update packages.

### 1.0.0

Initial release.
