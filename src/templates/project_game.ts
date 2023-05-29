import * as vscode from "vscode";
import * as path from "path";
import config from "../config";
import utils from "../utils";
import lspConfig from "./lsp_config";

function setupGameFiles(w: vscode.WorkspaceFolder, name: string) {
    utils.makeFiles(
        w.uri.fsPath,
        [
            {
                name: "game.conf",
            },
            {
                name: ".luarc.json",
                content: utils.formatJSON(lspConfig),
            },
            {
                name: "README.md",
                content: `# ${name}`,
            },
        ],
        ["menu", "mods"]
    );
}

function gameCompletionSnippet(name: string): vscode.SnippetString {
    return new vscode.SnippetString(`
title = ${name}
description = $1
allowed_mapgens = $2
disallowed_mapgens = $3
disallowed_mapgen_settings = $4
disabled_settings = $5
map_persistent = $\{6:true\}
author = $7

min_minetest_version = $8
max_minetest_version = $9
$0`);
}

function setupGameInWorkspaceFolder(w: vscode.WorkspaceFolder) {
    let folder = w.uri.toString();
    let folderName = path.parse(folder).base;

    // Determine plausible game title
    // Replace `_` and `-` by spaces and make first letter of each word uppercase
    let namePrediction = folderName.replace(/[_-]/g, " ").replace(/(^| )(\w)/g, function (m) {
        return m.toUpperCase();
    });

    vscode.window
        .showInputBox({
            title: "Create Game",
            prompt: "Game Name",
            value: namePrediction,
        })
        .then((value) => {
            if (value) {
                config.setContext(w, "game");
                setupGameFiles(w, value);

                utils.openWithSnippet(path.join(folder, "game.conf"), gameCompletionSnippet(value));
            }
        });
}

export default { setupGameInWorkspaceFolder };
