import * as vscode from "vscode";
import folder_mod from "../templates/folder_mod";

export default vscode.commands.registerCommand("minetest-tools.folderMod", (u: vscode.Uri) => {
    let w = vscode.workspace.getWorkspaceFolder(u);

    if (!w) {
        vscode.window.showErrorMessage("Invalid URI: " + u);
    }

    folder_mod.setupModInFolder(u);
});
