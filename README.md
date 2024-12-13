# Luanti (formerly Minetest) Tools

[Repository](https://github.com/GreenXenith/minetest-tools/) | [Issues](https://github.com/GreenXenith/minetest-tools/issues/)

## Features

-   Minetest (5.9.1) Lua API code autocompletion
-   Mod and game folder structure boilerplates
-   `.luacheckrc` generator (globals only)
-   Formspec string syntax highlighting

Note: Code snippets were generated from `lua_api.md` using `snippets.js`. Quality not guaranteed.

## Extension Settings

-   `minetest-tools.workspaceOnly`: Code snippets will only be shown if certain files/folders (`init.lua`, `mods`, `modpack.txt`) are detected in the main workspace folder (default: `true`).

-   `editor.quickSuggestions.strings`: Some snippets (formspecs, texture modifiers) depend on string suggestions being enabled. This can be very annoying sometimes, so the snippets will only work if the `string` key in `editor.quickSuggestions` is set to `true`.

    It should look something like this:

    ```json
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
    }
    ```

## TODO

-   Make autocomplete snippets update automatically when needed
-   Generate .luacheckrc and snippet.js from API
-   Fix formspec element autocomplete (this will require a language server)

## Release Notes

### 1.4.3: November 4, 2024

-   API autocompletion bumped to Minetest version 5.9.1

### 1.4.2: May 2, 2023

-   API autocompletion bumped to Minetest version 5.7.0
-   Only store API reference line numbers in snippet file to reduce size

### 1.4.1: June 12, 2021

-   Fixed function arguments breaking on certain characters
-   Fixed autocompletion of constants

### 1.4.0: April 30, 2021

-   API autocompletion bumped to Minetest version 5.4.1
-   Rewrote snippet generator
    -   No longer requires manual input
    -   Captures all API methods, tables, and constants
    -   Adjusted quick info formatting
    -   Includes API links
-   CompletionItemProvider can handle some backspacing now
-   Methods with functions as parameters are a little smarter now
-   Texture modifiers will remove trailing bracket if autocompleted
-   Global constructors and namespaces now have snippets
-   Added missing globals to .luacheckrc
-   Fixed and tweaked formspec highlighting
