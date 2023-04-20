import * as vscode from "vscode";
import commands from "./commands";
import config from "./config";
import utils from "./utils";

function activate(context: vscode.ExtensionContext) {
    console.log("Minetest Tools extension starting...");

    // Register commands
    commands.initCommands(context);

    // Init Config System
    config.initConfig(context);

    // Init Translation Providers
    utils.initTranslation(context);

    console.log("Minetest Tools extension is active.");
}

export { activate };
