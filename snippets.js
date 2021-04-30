const fs = require("fs");

function docLink(api, search) {
    const line = api.substring(0, api.indexOf(search)).split("\n").length;
    return line > 1 ? `\n\n[View in lua_api.txt](https://github.com/minetest/minetest/blob/5.4.1/doc/lua_api.txt#L${line}-L${line + search.split("\n").length - 1})` : ""
}

let types = [];

const objects = (entry, api) => {
    entry = entry.substr(1);
    // The documented thing (* `between here`:)
    const name = entry.match(/^\* `([^\n`:]+)/)[1];
    // The specific name (* `minetest.justthisfunction(but, not, the, args)`:)
    const lookfor = name.match(/(?:\S+?\.)?([^\(]+)/)[1];
    // The completed thing without namespaces and with argument tabstops if applicable
    let i = 0;
    const complete = name.match(/([^.]*)$/)[0].replace(/\(([^(]+)\)/, args => {
        return args.replace(/(?! )[\w\- ]+/g, arg => `\${${++i}:${arg}}`);
    }).replace(/(\(function\(.+)\)$/, `$1\n\t$${++i}\nend)`) + "$0";
    // Full method documentation
    const doc = entry.match(/^\* ([\S\s]*?)\n*$/)[1].replace(/\n    /g, "\n") + docLink(api, entry); // Remove extra indent
    // Type of thing
    const type = name.match(/\(/) && (name.match(/\./) && "Function" || "Method") || "Object";
    // Namespace or method character (:)
    const namespace = ((name.match(/^HTTPApiTable/) && {1: "."}) || name.match(/^(\S*?\.)/) || {1: ":"})[1];

    return {
        prefix: lookfor, // look for this
        body: complete, // set to this
        desc: doc, // documentation description
        kind: {Function: 2, Method: 1, Object: 5}[type], // this type
        detail: type, // header detail
        token: namespace, // look after this
    };
}

// Functions and methods
types.push([/\n\* `(?!dump)[^\(][^`:]+\).*(?:\n+ +.+)*/g, objects]);

// Lists and objects
types.push([/\n\* `minetest\.(?!conf)(?![A-Z_\-]+?`)[^\(\)]+?`.*(?:\n+ +.+)*/g, objects]);

// Formspec elements
types.push([/### `.+\[.*\n?\n[\S\s]+?\n\n/g, (entry, api) => {
    return {
        prefix: entry.match(/^### `(.+?)\[/)[1],
        body: entry.match(/^### `(.+?\])/)[1].replace(/<(.+?)>/g, "$1") + "$0",
        desc: entry.match(/^([\S\s]*?)\n*$/)[1] + docLink(api, entry),
        kind: 13,
        detail: "Formspec Element",
        // token: entry.match(/^### `(.)/)[1],
    };
}]);

// Texture modifiers
types.push([/#### `\[.+\n\n(?:[^\n]+\n+(?!(?:####)|(?:\-+\n)))+/g, (entry, api) => {
    let i = 0;
    return {
        prefix: entry.match(/\[([\w_-]+)/)[1],
        body: entry.match(/\[(.+?)`/)[1].replace(/<(.+?)>|(\.\.\.)/g, (arg1, arg2) => `\${${++i}:${arg1 || arg2}}`) + "$0",
        desc: entry.match(/^([\S\s]+?)\n*$/)[1] + docLink(api, entry),
        kind: 7,
        detail: "Texture Modifier",
        token: "[",
    };
}]);

// Constants
types.push([/[`']minetest\.[A-Z_\-]+[`'](?:.{5,}|.{0})/g, (entry, api) => {
    return {
        prefix: entry.match(/\.(.+?)[`']/)[1],
        body: entry.match(/[`'](.+?)[`']/)[1],
        desc: entry.replace(/'/g, "`") + docLink(api, entry),
        kind: 11,
        detail: "Constant",
        token: "minetest.",
    };
}]);

function getSnippets(api) {
    let snippets = [];

    for (const type of types) {
        for (let entry of api.matchAll(type[0])) {
            snippets.push(type[1](entry[0], api));
        }
    }

    return snippets;
}

fs.readFile("./lua_api.txt", "utf8", (err, data) => {
    if (!err) fs.writeFile("./smartsnippets.json", JSON.stringify(getSnippets(data)), "utf8", () => {});
});
