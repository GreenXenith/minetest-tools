import * as vscode from "vscode";
import project_game from "./project_game";
import project_mod from "./project_mod";
import material_icon_theme from "./material_icon_theme";

function initCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(project_game, project_mod, material_icon_theme);
}

export default { initCommands };
