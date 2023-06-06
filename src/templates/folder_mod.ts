import * as vscode from "vscode";
import * as path from "path";

import utils from "../utils";

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
                } else if (!utils.validateModName(value)) {
                    return {
                        message: "Invalid mod name, can only contain [a-z_]",
                        severity: vscode.InputBoxValidationSeverity.Error,
                    };
                }

                return undefined;
            },
        })
        .then((value) => {
            if (value) {
                // Setup mod folder
                setupFolderModFiles(folder, value);

                // Open main mod.conf file
                utils.openWithSnippet(path.join(folder, value, "mod.conf"), folderModCompletionSnippet(value));
            }
        });
}

export default { setupModInFolder };
