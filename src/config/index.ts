import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

type ExtensionConfigContext = "game" | "mod";

/**
 * Represent the configuration of the extension for a workspace folder
 */
type ExtensionConfigFolder = {
    context: ExtensionConfigContext;
};

/**
 * Array of workspace folders configuration, full fs path as key
 *
 * Having null as value means that the folder have no configuration file
 */
const workspaceConfig = new Map<string, ExtensionConfigFolder | null>();

/**
 * Update workspace configuration map when opened workspaces changes
 */
let t = vscode.workspace.onDidChangeWorkspaceFolders((e) => {
    for (const r in e.removed) {
        const f = e.removed[r];

        workspaceConfig.delete(f.uri.fsPath);
    }

    for (const a in e.added) {
        const f = e.added[a];
        workspaceConfig.set(f.uri.fsPath, parseConfig(f));
    }

    //vscode.window.showInformationMessage(workspaceConfig.values());
});

/**
 * Update config from initially loaded workspaces
 */
if (vscode.workspace.workspaceFolders) {
    for (let k = 0; k < vscode.workspace.workspaceFolders.length; k++) {
        const f = vscode.workspace.workspaceFolders[k];
        workspaceConfig.set(f.uri.fsPath, parseConfig(f));
    }
}

/**
 * Watch for filesystem changes and update workspaceConfig
 */

function updateConfigFromFileChanges(e: vscode.Uri) {
    vscode.window.showInformationMessage("CHANGED: ", e.fsPath);

    if (vscode.workspace.workspaceFolders) {
        for (let k = 0; k < vscode.workspace.workspaceFolders.length; k++) {
            const f = vscode.workspace.workspaceFolders[k];
            try {
                let d = path.parse(e.fsPath).dir;
                if (d === f.uri.fsPath) {
                    workspaceConfig.set(f.uri.fsPath, parseConfig(f));
                }
            } catch {}
            //vscode.window.showInformationMessage("FULL: " + f.uri.path + ": " + getContext(f));
        }
    }
}

let fsw = vscode.workspace.createFileSystemWatcher("**/.minetest-tools.json");
fsw.onDidChange(updateConfigFromFileChanges);
fsw.onDidCreate(updateConfigFromFileChanges);
fsw.onDidDelete(updateConfigFromFileChanges);

/**
 * Parse the config file of the workspace folder if present
 *
 * Only for internal use inside this file
 */
function parseConfig(f: vscode.WorkspaceFolder): ExtensionConfigFolder | null {
    const configPath = path.join(f.uri.fsPath, ".minetest-tools.json");
    try {
        const content = fs.readFileSync(configPath, { encoding: "utf-8" });
        const parsedContent = JSON.parse(content);
        if (parsedContent.context !== "game" && parsedContent.context !== "mod") {
            return null;
        } else {
            return {
                context: parsedContent.context,
            };
        }
    } catch (error) {
        return null;
    }
}

/**
 * Save a ExtensionConfigFolder to the config file in the root of the given workspace folder
 *
 * Only for internal use inside this file
 */
function saveConfig(f: vscode.WorkspaceFolder, c: ExtensionConfigFolder | null) {
    const configPath = path.join(f.uri.fsPath, ".minetest-tools.json");
    try {
        //const content = fs.readFileSync(configPath, { encoding: "utf-8" });
        //const parsedContent = JSON.parse(content);
        fs.writeFileSync(configPath, JSON.stringify(c, undefined, 4));
    } catch (error) {
        return null;
    }
}

/**
 * Return the configuration for a workspace, or null if context
 */
function getConfig(w: vscode.WorkspaceFolder): ExtensionConfigFolder | null {
    let c = workspaceConfig.get(w.uri.fsPath);
    if (c === undefined) {
        return null;
    } else {
        return c;
    }
}

/**
 * Get the configuration of the extension context or "none" for a {@linkcode vscode.WorkspaceFolder WorkspaceFolder}, with TypeScript annotations
 */
function getContext(w: vscode.WorkspaceFolder): "none" | ExtensionConfigContext {
    const t = workspaceConfig.get(w.uri.fsPath)?.context;
    return t ? t : "none";
}

/**
 * (WIP) Update the configuration of the extension context for the {@linkcode vscode.WorkspaceFolder WorkspaceFolder}
 *
 * @todo should this function be able to actually delete the config file is called with "none"?
 */
function setContext(w: vscode.WorkspaceFolder, c: "none" | ExtensionConfigContext) {}

if (vscode.workspace.workspaceFolders) {
    for (let k = 0; k < vscode.workspace.workspaceFolders.length; k++) {
        const f = vscode.workspace.workspaceFolders[k];
        vscode.window.showInformationMessage(f.uri.fsPath + " : " + getContext(f));
    }
}

/**
 * Register VSCode disposals (should only be called once in extension.ts)
 */
function initConfig(context: vscode.ExtensionContext) {
    context.subscriptions.push(t, fsw);
}

export type { ExtensionConfigFolder, ExtensionConfigContext };

export default { initConfig, getConfig, getContext, setContext };
