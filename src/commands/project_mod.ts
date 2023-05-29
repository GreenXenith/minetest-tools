import * as vscode from "vscode";
import project_mod from "../templates/project_mod";

export default vscode.commands.registerCommand("minetest-tools.modProject", () => {
    let folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage("Open a folder or workspace");
    } else if (folders.length === 1) {
        project_mod.setupModInWorkspaceFolder(folders[0]);
    } else {
        vscode.window
            .showWorkspaceFolderPick({
                placeHolder: "Pick a workspace folder to create the mod",
            })
            .then((e) => {
                if (e) {
                    project_mod.setupModInWorkspaceFolder(e);
                } else {
                    vscode.window.showErrorMessage("You must choose a name");
                }
            });
    }
});
