import * as vscode from "vscode";
import online_resources from "./online_resources";
import folder_mod from "./folder_mod";
import project_game from "./project_game";
import project_mod from "./project_mod";
import material_icon_theme from "./material_icon_theme";

function initCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(online_resources, folder_mod, project_game, project_mod, material_icon_theme);
}

export default { initCommands };
