import * as vscode from "vscode";

type StringAssociation = {
    [index: string]: string;
};

const materialIconThemeConfigFolders: StringAssociation = {
    textures: "images",
    models: "container",
};

/* eslint-disable @typescript-eslint/naming-convention */
const materialIconThemeConfigFiles: StringAssociation = {
    "locale/template.txt": "i18n",
    "*.tr": "i18n",
};
/* eslint-enable @typescript-eslint/naming-convention */

export default vscode.commands.registerCommand("minetest-tools.configureMaterialIconTheme", () => {
    let config = vscode.workspace.getConfiguration("material-icon-theme");

    const fconfig = config.get<StringAssociation>("folders.associations");
    config.update("folders.associations", { ...fconfig, ...materialIconThemeConfigFolders });

    const pconfig = config.get<StringAssociation>("files.associations");
    config.update("files.associations", { ...pconfig, ...materialIconThemeConfigFiles });
});
