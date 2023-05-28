import * as vscode from "vscode";

/**
 * Return the given object formated as JSON with workspace indentation settings
 */
function formatJSON(obj: any): string {
    return JSON.stringify(obj, undefined, getJSONIndentation());
}

// FIXME: allow indenting with tabs
function getJSONIndentation(): number | string {
    const editorConfig = vscode.workspace.getConfiguration("editor", { languageId: "json" });
    let indentSize = editorConfig.get<"tabSize" | number>("indentSize");

    if (indentSize === "tabSize") {
        let tabSpace = editorConfig.get<number>("tabSize");
        return tabSpace ? tabSpace : 4;
    } else {
        return indentSize ? indentSize : 4;
    }
}

export { formatJSON, getJSONIndentation };
