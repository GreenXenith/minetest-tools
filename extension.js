const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const snippets = require("./smartsnippets.json");

const rootPath = vscode.workspace.workspaceFolders != undefined ? vscode.workspace.workspaceFolders[0].uri.fsPath : "";
const doc_api_link = "\n\n[View in lua_api.md](https://github.com/minetest/minetest/blob/5.9.1/doc/lua_api.md?plain=1#";
const luacheckrc = `read_globals = {
    "DIR_DELIM", "INIT",

    "minetest", "core",
    "dump", "dump2",

    "Raycast",
    "Settings",
    "PseudoRandom",
    "PerlinNoise",
    "VoxelManip",
    "SecureRandom",
    "VoxelArea",
    "PerlinNoiseMap",
    "PcgRandom",
    "ItemStack",
    "AreaStore",

    "vector",

    table = {
        fields = {
            "copy",
            "indexof",
            "insert_all",
            "key_value_swap",
            "shuffle",
        }
    },

    string = {
        fields = {
            "split",
            "trim",
        }
    },

    math = {
        fields = {
            "hypot",
            "sign",
            "factorial"
        }
    },
}`;

function makeFiles(files, folders) {
    for (const folder of folders) {
        const fullpath = path.join(rootPath, folder);
        if (!fs.existsSync(fullpath)) {
            fs.mkdirSync(fullpath);
        }
    }
    for (const file of files) {
        const fullpath = path.join(rootPath, file.name);
        if (!fs.existsSync(fullpath)) {
            fs.writeFileSync(fullpath, file.content);
        }
    }
}

function activate(context) {
    // Intellisense
    let completion = vscode.languages.registerCompletionItemProvider({language: "lua", scheme: "file"}, {
        provideCompletionItems(document, position) {
            // Only show snippets if in a Minetest workspace
            if (vscode.workspace.getConfiguration("minetest-tools").get("workspaceOnly") &&
                    !(fs.existsSync(path.join(rootPath, "init.lua")) ||
                    fs.existsSync(path.join(rootPath, "mods")) ||
                    fs.existsSync(path.join(rootPath, "modpack.txt")))
                ) return [];

            const line = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
            const afterpos = new vscode.Range(position, new vscode.Position(position.line, position.character + 1));
            const after = document.getText(afterpos);

            let items = [];

            for (const snippet of snippets) {
                if (snippet.token && line.match(new RegExp(`${snippet.token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}(?![^\\w\\n\\s\\r\\-])[\\w\\n\\s\\r\\-]*`))) {
                    let item = new vscode.CompletionItem(snippet.prefix);
                    item.insertText = new vscode.SnippetString(snippet.body);
                    item.documentation = new vscode.MarkdownString(snippet.desc + (snippet.doc_lines ? doc_api_link + snippet.doc_lines + ")" : ""));
                    item.kind = snippet.kind;
                    item.detail = snippet.detail || snippet.prefix;
                    item.additionalTextEdits = (snippet.token.match(/^[\(\[\{]$/) && after.match(/[\}\]\)]/)) ? [vscode.TextEdit.delete(afterpos)] : null;

                    items.push(item);
                }
            }

            return items;
        },
    }, ":", ".", "[");

    // Mod boilerplate
    let modproject = vscode.commands.registerCommand("extension.modProject", () => {
        if (rootPath == "") return;
        const name = vscode.workspace.name;
        const files = [
            {
                "name": "init.lua",
                "content": ""
            },
            {
                "name": "mod.conf",
                "content": `name = ${name}\ndescription = \ndepends = \noptional_depends = `
            },
            {
                "name": "README.md",
                "content": ""
            },
            {
                "name": "LICENSE.txt",
                "content": ""
            },
            {
                "name": ".luacheckrc",
                "content": luacheckrc
            }
        ];
        const folders = ["textures", "models", "sounds"];
        makeFiles(files, folders);
    });

    // Game boilerplate
    let gameproject = vscode.commands.registerCommand("extension.gameProject", () => {
        if (rootPath == "") return;
        const name = vscode.workspace.name;
        const files = [
            {
                "name": "game.conf",
                "content": `name = ${name.replace(/[_-]/g, " ").replace(/(^| )(\w)/g, function(m) {
                    return m.toUpperCase();
                })}\nauthor = \ndescription = `
            },
            {
                "name": "README.md",
                "content": ""
            },
            {
                "name": "LICENSE.txt",
                "content": ""
            },
            {
                "name": ".luacheckrc",
                "content": luacheckrc
            }
        ];
        const folders = ["menu", "mods"];
        makeFiles(files, folders);
    });

    // .luacheckrc generator
    let luacheck = vscode.commands.registerCommand("extension.luacheckrc", () => {
        if (rootPath == "") return;
        makeFiles([
            {
                "name": ".luacheckrc",
                "content": luacheckrc
            }
        ], []);
    })

    // Toggle workspace-only snippets
    let toggle = vscode.commands.registerCommand("extension.workspaceToggle", () => {
        const conf = vscode.workspace.getConfiguration("minetest-tools");
        const newVal = conf.get("workspaceOnly") ? false : true;
        conf.update("workspaceOnly", newVal, true);
        vscode.window.showInformationMessage(newVal ? "Minetest Intellisense active in workspace only." : "Minetest Intellisense active for all Lua files.");
    })

    context.subscriptions.push(completion, modproject, gameproject, luacheck, toggle);

    console.log("Minetest Tools extension is active.");
}
exports.activate = activate;

module.exports = {
    activate
}
