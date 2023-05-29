import * as vscode from "vscode";
import project_game from "./project_game";
import project_mod from "./project_mod";

function initCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(project_game, project_mod);
}

export default { initCommands };
