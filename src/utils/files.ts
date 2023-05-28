import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Create a list of files and folders under rootPath if not present
 */
function makeFiles(rootPath: string, files: Array<{ name: string; content?: string }>, folders: Array<string>) {
    for (const folder of folders) {
        const fullpath = path.join(rootPath, folder);
        if (!fs.existsSync(fullpath)) {
            fs.mkdirSync(fullpath);
        }
    }
    for (const file of files) {
        const fullpath = path.join(rootPath, file.name);
        if (!fs.existsSync(fullpath)) {
            fs.writeFileSync(fullpath, file.content || "");
        }
    }
}

/**
 * Open a text file, apply the given snippet if file is empty
 */
function openWithSnippet(file: string, snippet: vscode.SnippetString) {
    vscode.workspace.openTextDocument(file).then((d) => {
        vscode.window.showTextDocument(d, undefined, false).then((t) => {
            if (t.document.getText().length === 0) {
                t.insertSnippet(snippet);
            }
        });
    });
}

export { makeFiles, openWithSnippet };
