import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import utils from "../utils";
import config from "../config";

function setupFolderModFiles(path: string, name: string) {
    utils.makeFiles(
        path,
        [
            {
                name: "mod.conf",
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

function folderModCompletionSnippet(name: string): vscode.SnippetString {
    return new vscode.SnippetString(`
name = ${name}
description = $1
depends = $2
optional_depends = $3
author = $4
title = $5
$0`);
}

function setupModInFolder(u: vscode.Uri) {
    let folder = u.fsPath;

    const w = vscode.workspace.getWorkspaceFolder(u);

    if (!w) {
        vscode.window.showErrorMessage("Given URI isn't in a workspace folder!");
        return;
    }

    const context = config.getContext(w);

    // TODO: add modpack context
    if (context === undefined || context !== "game") {
        vscode.window.showErrorMessage("Workspace isn't a game or a modpack!");
        return;
    }

    // const wPath = w.uri.fsPath;

    // TODO: handle modpacks
    if (context === "game") {
        if (path.basename(folder) !== "mods") {
            vscode.window.showErrorMessage("Folder can't handle mods!");
            return;
        }
    }

    vscode.window
        .showInputBox({
            title: "Create Mod",
            prompt: "Mod Technical Name",
            validateInput(value) {
                if (value.length === 0) {
                    return {
                        message: "Mod name can't be empty",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                }

                if (!utils.validateModName(value)) {
                    return {
                        message: "Invalid mod name, can only contain [a-z_]",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                }

                if (fs.existsSync(path.join(folder, value))) {
                    return {
                        message: "A folder with that name already exist",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                }

                return undefined;
            },
        })
        .then((value) => {
            if (value) {
                // Create mod folder
                fs.mkdirSync(path.join(folder, value));

                // Setup mod folder
                setupFolderModFiles(path.join(folder, value), value);

                // Open main mod.conf file
                utils.openWithSnippet(path.join(folder, value, "mod.conf"), folderModCompletionSnippet(value));
            }
        });
}

export default { setupModInFolder };
