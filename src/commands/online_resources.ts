import * as vscode from "vscode";

const links: [string, vscode.Uri][] = [
    ["Minetest Website", vscode.Uri.parse("https://www.minetest.net")],
    ["Minetest ContentDB", vscode.Uri.parse("https://content.minetest.net")],
    ["Minetest GitHub", vscode.Uri.parse("https://github.com/minetest/minetest")],
    ["Minetest Forums", vscode.Uri.parse("https://forum.minetest.net")],
];

export default vscode.commands.registerCommand("minetest-tools.browseOnlineResources", () => {
    vscode.window
        .showQuickPick(
            links.map((value) => value[0]),
            { title: "Online Resources", canPickMany: false }
        )
        .then((value) => {
            const l = links.find((d) => d[0] === value);
            if (l) {
                vscode.env.openExternal(l[1]);
            }
        });
});
