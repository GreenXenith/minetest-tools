import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

type ExtensionConfigContext = "none" | "game" | "mod";

/**
 * Represent the configuration of the extension for a workspace folder
 */
type ExtensionConfigFolder = {
    /**
     * The context of the workspace folder
     */
    context: ExtensionConfigContext;
};

/**
 * Array of workspace folders configuration, full fs path as key
 */
const workspaceConfig = new Map<string, ExtensionConfigFolder>();

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
 *
 * If the file at given URI isn't at the root of the workspace folder, will not update configuration
 */

function updateConfigFromFileChanges(e: vscode.Uri) {
    vscode.window.showInformationMessage("CHANGED: ", e.fsPath);

    if (vscode.workspace.workspaceFolders) {
        for (let k = 0; k < vscode.workspace.workspaceFolders.length; k++) {
            const f = vscode.workspace.workspaceFolders[k];
            try {
                if (path.parse(e.fsPath).dir === f.uri.fsPath) {
                    workspaceConfig.set(f.uri.fsPath, parseConfig(f));
                }
            } catch {}
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
function parseConfig(f: vscode.WorkspaceFolder): ExtensionConfigFolder {
    const configPath = path.join(f.uri.fsPath, ".minetest-tools.json");
    try {
        const content = fs.readFileSync(configPath, { encoding: "utf-8" });
        const parsedContent = JSON.parse(content);
        if (parsedContent.context !== "game" && parsedContent.context !== "mod") {
            return { context: "none" };
        } else {
            return {
                context: parsedContent.context,
            };
        }
    } catch (error) {
        return { context: "none" };
    }
}

/**
 * Save the config file of the given workspace folder
 *
 * Only for internal use inside this file, should be called after modifying a workspace config
 *
 * Return boolean indicating sucess
 */
function saveConfig(f: vscode.WorkspaceFolder): boolean {
    let c = workspaceConfig.get(f.uri.fsPath);
    if (!c) {
        return false;
    }

    const configPath = path.join(f.uri.fsPath, ".minetest-tools.json");
    try {
        fs.writeFileSync(configPath, JSON.stringify(c, undefined, 4));
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Return the configuration for a workspace
 *
 * Return undefined if workspace folder is invalid
 */
function getConfig(w: vscode.WorkspaceFolder): ExtensionConfigFolder | undefined {
    return workspaceConfig.get(w.uri.fsPath);
}

/**
 * Get the configuration of the extension context for a {@linkcode vscode.WorkspaceFolder WorkspaceFolder}, with TypeScript annotations
 *
 * Return undefined if workspace folder is invalid
 */
function getContext(w: vscode.WorkspaceFolder): ExtensionConfigContext | undefined {
    return workspaceConfig.get(w.uri.fsPath)?.context;
}

/**
 * Update the configuration of the extension context for the {@linkcode vscode.WorkspaceFolder WorkspaceFolder}
 *
 * Return boolean indicating sucess
 */
function setContext(w: vscode.WorkspaceFolder, c: ExtensionConfigContext): boolean {
    let config = workspaceConfig.get(w.uri.fsPath);

    if (config) {
        config.context = c;
        saveConfig(w);
        return true;
    } else {
        return false;
    }
}

// TODO: remove this debug display
/*
if (vscode.workspace.workspaceFolders) {
    for (let k = 0; k < vscode.workspace.workspaceFolders.length; k++) {
        const f = vscode.workspace.workspaceFolders[k];
        vscode.window.showInformationMessage(f.uri.fsPath + " : " + getContext(f));
    }
}*/

/**
 * Register VSCode disposals (should only be called once in extension.ts)
 */
function initConfig(context: vscode.ExtensionContext) {
    context.subscriptions.push(t, fsw);
}

export type { ExtensionConfigFolder, ExtensionConfigContext };

export default { initConfig, getConfig, getContext, setContext };
