# Minetest Tools
[Repository](https://github.com/GreenXenith/minetest-tools/) | [Issues](https://github.com/GreenXenith/minetest-tools/issues/)

## Features

- Minetest (5.1.0) Lua API code snippets
- Mod and game folder structure boilerplates
- `.luacheckrc` generator (globals only)
- Formspec string syntax highlighting

**Note:** Code snippets were generated from `lua_api.txt` using the `parse.lua` script. Quality of descriptions and amount of available snippets may be sub-par. `snippets.json` is __not__ pretty-printed.

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

* Fix formspec element autocomplete and add no-namespace snippets (needs token-independent snippets)

## Release Notes

### 1.3.0: January 13, 2020
- Reworked intellisense

### 1.2.0: January 13, 2020
- Improved autocomplete suggestions
- Fixed snippets not working with other Intellisense extensions

### 1.1.0: January 10, 2020
- Added formspec string syntax highlighting
