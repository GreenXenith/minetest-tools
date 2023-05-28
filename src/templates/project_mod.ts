import * as vscode from "vscode";
import * as path from "path";
import config from "../config";
import utils from "../utils";
import lspConfig from "./lsp_config";

// Mod directory structure
/*
├── locale
├── models
├── sounds
├── textures
├── .luarc.json
├── .minetest-tools.json
├── init.lua
├── mod.conf
└── README.md
*/

function setupModFiles(w: vscode.WorkspaceFolder, name: string) {
    utils.makeFiles(
        w.uri.fsPath,
        [
            {
                name: "mod.conf",
            },
            {
                name: ".luarc.json",
                content: utils.formatJSON(lspConfig),
            },
            {
                name: "init.lua",
            },
            {
                name: "README.md",
                content: `# ${name}`,
            },
        ],
        ["locale", "textures", "models", "sounds"]
    );
}

function modCompletionSnippet(name: string): vscode.SnippetString {
    return new vscode.SnippetString(`
name = ${name}
description = $1
depends = $2
optional_depends = $3
author = $4
title = $5

min_minetest_version = $6
max_minetest_version = $7
supported_games = $8
unsupported_games = $9
$0`);
}

function setupModInWorkspaceFolder(w: vscode.WorkspaceFolder) {
    let folder = w.uri.fsPath;
    let folderName = path.parse(folder).base;

    // Determine plausible mod technical name
    // Replace spaces by `_` and make lowercase
    let namePrediction = folderName.replace(" ", "_").toLowerCase();

    vscode.window
        .showInputBox({
            title: "Create Mod",
            prompt: "Mod Technical Name",
            value: namePrediction,
            validateInput(value) {
                if (value.length === 0) {
                    return {
                        message: "Mod name can't be empty",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                } else if (!utils.validateModName(value)) {
                    return {
                        message: "Invalid mod name, can only contain [a-z_]",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                }
            },
        })
        .then((value) => {
            if (value) {
                config.setContext(w, "mod");
                setupModFiles(w, value);

                // TODO: make a title prediction

                utils.openWithSnippet(path.join(folder, "mod.conf"), modCompletionSnippet(value));
            }
        });
}

export default { setupModInWorkspaceFolder };
