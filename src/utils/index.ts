import { makeFiles, openWithSnippet } from "./files";
import { formatJSON, getJSONIndentation } from "./json";
import { extensionFolder } from "./extension_folder";
import { validateModName } from "./validation";
import { getGitAPI, initGitRepoIfEnabled, getGitUserName } from "./git";

export default {
    makeFiles,
    formatJSON,
    getJSONIndentation,
    openWithSnippet,
    extensionFolder,
    validateModName,
    getGitAPI,
    initGitRepoIfEnabled,
    getGitUserName,
};
