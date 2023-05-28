import * as vscode from "vscode";

/**
 * Return the path of the extension folder
 */
function extensionFolder(): string {
    return vscode.extensions.getExtension("GreenXenith.minetest-tools")?.extensionPath as string;
}

export { extensionFolder };
