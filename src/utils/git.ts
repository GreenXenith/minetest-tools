import * as vscode from "vscode";
import { getExtensionConfigGitSupport } from "./global_config";
import { GitExtension } from "../types/git";

// Assuming the extention is installed and enabled, since we depend on it
const gitExtension = (vscode.extensions.getExtension<GitExtension>("vscode.git") as vscode.Extension<GitExtension>)
    .exports;
const git = gitExtension.getAPI(1);

/**
 * Return the Git extention API
 */
function getGitAPI() {
    return git;
}

/**
 * If Git support is enabled, initialize a Git repository at given URI
 */
function initGitRepoIfEnabled(uri: vscode.Uri) {
    if (getExtensionConfigGitSupport()) {
        getGitAPI().init(uri);
    }
}

/**
 * NOT WORKING YET
 */
async function getGitUserName(uri: vscode.Uri): Promise<string | undefined> {
    //return await git.getRepository(uri)?.getConfig("user.name");
    return JSON.stringify(await git.getRepository(uri)?.getConfigs());
}

export { getGitAPI, initGitRepoIfEnabled, getGitUserName };
