/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Configuration object for the Lua LSP specially crafted for Minetest
 *
 * Should be converted to JSON config files like `.luarc.json` or `.luarc.jsonc`
 */
const lspConfig = {
    "runtime.version": "LuaJIT", // Minetest uses LuaJIT or Lua 5.1 with the bit library
    "diagnostics.disable": ["lowercase-global"], // Minetest doesn't follow that convention
    "diagnostics.globals": [
        // Allow non-vscode users to get fewer warnings when using the LSP
        "minetest",
        "core",
        "dump",
        "dump2",
        "Raycast",
        "Settings",
        "PseudoRandom",
        "PerlinNoise",
        "VoxelManip",
        "SecureRandom",
        "VoxelArea",
        "PerlinNoiseMap",
        "PcgRandom",
        "ItemStack",
        "AreaStore",
        "vector",
    ],
    "workspace.ignoreDir": [".luacheckrc"],
};

export default lspConfig;
