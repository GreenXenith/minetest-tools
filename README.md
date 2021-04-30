# Minetest Tools
[Repository](https://github.com/GreenXenith/minetest-tools/) | [Issues](https://github.com/GreenXenith/minetest-tools/issues/)

## Features

- Minetest (5.4.1) Lua API code autocompletion
- Mod and game folder structure boilerplates
- `.luacheckrc` generator (globals only)
- Formspec string syntax highlighting

Note: Code snippets were generated from `lua_api.txt` using `snippets.js`. Quality not guaranteed.  

## Extension Settings

* `minetest-tools.workspaceOnly`: Code snippets will only be shown if certain files/folders (`init.lua`, `mods`, `modpack.txt`) are detected in the main workspace folder (default: `true`).

* `editor.quickSuggestions.strings`: Some snippets (formspecs, texture modifiers) depend on string suggestions being enabled. This can be very annoying sometimes, so the snippets will only work if the `string` key in `editor.quickSuggestions` is set to `true`.   
It should look something like this:
	```json
	"editor.quickSuggestions": {
		"other": true,
		"comments": false,
		"strings": true
	}
	```

## TODO

* Make autocomplete snippets update automatically when needed
* Generate .luacheckrc and snippet.js from API
* Fix formspec element autocomplete (this will require a language server)

## Release Notes

### 1.4.0: April 30, 2021
- API autocompletion bumped to Minetest version 5.4.1
- Rewrote snippet generator
  - No longer requires manual input
  - Captures all API methods, tables, and constants
  - Adjusted quick info formatting
  - Includes API links
- CompletionItemProvider can handle some backspacing now
- Methods with functions as parameters are a little smarter now
- Texture modifiers will remove trailing bracket if autocompleted
- Global constructors and namespaces now have snippets
- Added missing globals to .luacheckrc
- Fixed and tweaked formspec highlighting

### 1.3.1: January 18, 2020
- Fixed incorrect method snippets

### 1.3.0: January 13, 2020
- Reworked intellisense
