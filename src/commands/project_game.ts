import * as vscode from "vscode";
import project_game from "../templates/project_game";

export default vscode.commands.registerCommand("minetest-tools.gameProject", () => {
    let folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage("Open a folder or workspace");
    } else if (folders.length === 1) {
        project_game.setupGameInWorkspaceFolder(folders[0]);
    } else {
        vscode.window
            .showWorkspaceFolderPick({
                placeHolder: "Pick a workspace folder to create the game",
            })
            .then((e) => {
                if (e) {
                    project_game.setupGameInWorkspaceFolder(e);
                } else {
                    vscode.window.showErrorMessage("You must choose a name");
                }
            });
    }
});
