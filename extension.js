const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const snippets = require("./snippets.json");

const rootPath = vscode.workspace.workspaceFolders != undefined ? vscode.workspace.workspaceFolders[0].uri.fsPath : "";
const luacheckrc = `read_globals = {
	"DIR_DELIM",
	"minetest", "core",
	"dump", "dump2",
	"vector",
	"VoxelManip", "VoxelArea",
	"PseudoRandom", "PcgRandom",
	"ItemStack",
	"Settings",
	"unpack",

	table = {
		fields = {
			"copy",
			"indexof",
			"insert_all",
			"key_value_swap",
		}
	},

	string = {
		fields = {
			"split",
			"trim",
		}
	},

	math = {
		fields = {
			"hypot",
			"sign",
			"factorial"
		}
	},
}`;

function makeFiles(files, folders) {
	for (const folder of folders) {
		const fullpath = path.join(rootPath, folder);
		if (!fs.existsSync(fullpath)) {
			fs.mkdirSync(fullpath);
		}
	}
	for (const file of files) {
		const fullpath = path.join(rootPath, file.name);
		if (!fs.existsSync(fullpath)) {
			fs.writeFileSync(fullpath, file.content);
		}
	}
}

function activate(context) {
	// Intellisense
	let args = [
		{language: "lua", scheme: "file"},
		{
			provideCompletionItems() {
				// Only show snippets if in a Minetest workspace
				if (vscode.workspace.getConfiguration("minetest-tools").get("workspaceOnly") &&
						!(fs.existsSync(path.join(rootPath, "init.lua")) ||
						fs.existsSync(path.join(rootPath, "mods")) ||
						fs.existsSync(path.join(rootPath, "modpack.txt")))
					) return [];
	
				let items = [];
	
				for (const snippet of snippets) {
					if (!(snippet.kind == 13 && !vscode.workspace.getConfiguration("editor").get("quickSuggestions").strings)) {
						const item = new vscode.CompletionItem(snippet.prefix);
						item.insertText = new vscode.SnippetString(snippet.body);
						item.documentation = new vscode.MarkdownString(snippet.desc);
						item.kind = snippet.kind || null;
		
						items.push(item);
					}
				}
	
				// Extra snippets (TODO: Move to snippets object)
				const vec = new vscode.CompletionItem("vector");
				vec.insertText = new vscode.SnippetString("{x = ${1:0}, y = ${2:0}, z = ${3:0}}");
				vec.documentation = new vscode.MarkdownString("`{x = 0, y = 0, z = 0}`");
				items.push(vec);
	
				return items;
			},
		}
	];

	for (const snippet of snippets) {
		const char = snippet.prefix.charAt(0);
		if (!args.includes(char)) {
			args.push(char);
		}
	}

	let completion = vscode.languages.registerCompletionItemProvider.apply(null, args);

	// Mod boilerplate
	let modproject = vscode.commands.registerCommand("extension.modProject", () => {
		if (rootPath == "") return;
		const name = vscode.workspace.name;
		const files = [
			{
				"name": "init.lua",
				"content": ""
			},
			{
				"name": "mod.conf",
				"content": `name = ${name}\ndescription = \ndepends = \noptional_depends = `
			},
			{
				"name": "README.md",
				"content": ""
			},
			{
				"name": "LICENSE.txt",
				"content": ""
			},
			{
				"name": ".luacheckrc",
				"content": luacheckrc
			}
		];
		const folders = ["textures", "models", "sounds"];
		makeFiles(files, folders);
	});

	// Game boilerplate
	let gameproject = vscode.commands.registerCommand("extension.gameProject", () => {
		if (rootPath == "") return;
		const name = vscode.workspace.name;
		const files = [
			{
				"name": "game.conf",
				"content": `name = ${name.replace(/[_-]/g, " ").replace(/(^| )(\w)/g, function(m) {
					return m.toUpperCase();
				})}\nauthor = \ndescription = `
			},
			{
				"name": "README.md",
				"content": ""
			},
			{
				"name": "LICENSE.txt",
				"content": ""
			},
			{
				"name": ".luacheckrc",
				"content": luacheckrc
			}
		];
		const folders = ["menu", "mods"];
		makeFiles(files, folders);
	});

	// .luacheckrc generator
	let luacheck = vscode.commands.registerCommand("extension.luacheckrc", () => {
		if (rootPath == "") return;
		makeFiles([
			{
				"name": ".luacheckrc",
				"content": luacheckrc
			}
		], []);
	})

	// Toggle workspace-only snippets
	let toggle = vscode.commands.registerCommand("extension.workspaceToggle", () => {
		const conf = vscode.workspace.getConfiguration("minetest-tools");
		const newVal = conf.get("workspaceOnly") ? false : true;
		conf.update("workspaceOnly", newVal, true);
		vscode.window.showInformationMessage(newVal ? "Minetest Intellisense active in workspace only." : "Minetest Intellisense active for all Lua files.");
	})

	context.subscriptions.push(completion, modproject, gameproject, luacheck, toggle);

	console.log("Minetest Tools extension is active.");
}
exports.activate = activate;

module.exports = {
	activate
}
