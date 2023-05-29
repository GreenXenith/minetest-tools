import * as vscode from "vscode";

function getExtentionConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("minetest-tools");
}

function getExtensionConfigGitSupport(): boolean {
    return getExtentionConfig().get<boolean>("gitSupport", true);
}

export { getExtentionConfig, getExtensionConfigGitSupport };
