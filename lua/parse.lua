-- This script generates `snippets.json` from `lua_api.txt`
-- Improvements are welcome.

local json = require("json")
local parse = {}
local globals = {"dump", "dump2"}

function table.exists(t, value)
	for k, v in pairs(t) do
		if v == value then
			return true, k
		end
	end
end

-- Cut out the useless stuff
parse.trim = function()
	local sections = {
		"Texture modifiers",
		"Node paramtypes",
		"Node drawtypes",
		"Elements",
		"Escape sequences",
		"Spatial Vectors",
		"Helper functions",
		"Translate a string",
		"Methods",
		"VoxelArea",
		"Registered entities",
		"Utilities",
		"Logging",
		"Registration functions",
		"Global callback registration functions",
		"Setting-related",
		"Authentication",
		"Chat",
		"Environment access",
		"Mod channels",
		"Inventory",
		"Formspec",
		"Item handling",
		"Rollback",
		"Defaults for the `on_place` and `on_drop` item definition functions",
		"Defaults for the `on_punch` and `on_dig` node definition callbacks",
		"Sounds",
		"Timing",
		"Server",
		"Bans",
		"Particles",
		"Schematics",
		"HTTP Requests",
		"Storage API",
		"Misc.",
		"Global tables",

		"`AreaStore`",
		"`InvRef`",
		"`ItemStack`",
		"`ItemStackMetaRef`",
		"`MetaDataRef`",
		"`ModChannel`",
		"`NodeMetaRef`",
		"`NodeTimerRef`",
		"`ObjectRef`",
		"`PcgRandom`",
		"`PerlinNoise`",
		"`PerlinNoiseMap`",
		"`PseudoRandom`",
		"`Raycast`",
		"`SecureRandom`",
		"`Settings`",

		"Object properties",
		"Entity definition",
		"ABM (ActiveBlockModifier) definition",
		"LBM (LoadingBlockModifier) definition",
		"Item definition",
		"Node definition",
		"Crafting recipes",
		"Ore definition",
		"Biome definition",
		"Decoration definition",
		"Chat command definition",
		"Privilege definition",
		"Detached inventory callbacks",
		"HUD Definition",
		"Particle definition",
		"`ParticleSpawner` definition",
		"`HTTPRequest` definition",
		"`HTTPRequestResult` definition",
		"Authentication handler definition",
	}

	local file = io.open("trimmed.txt", "w")
	local queue = {}
	local section = ""

	for line in io.lines("lua_api.txt") do
		queue[#queue + 1] = line

		if queue[2] and queue[2]:match("^[=-]+$") then
			if table.exists(sections, queue[1]) then
				section = queue[1]
			else
				section = ""
			end
		end

		if section ~= "" then
			file:write("\n" .. queue[1])
		end

		if #queue == 3 then
			table.remove(queue, 1)
		end
	end

	for _, line in pairs(queue) do
		file:write("\n" .. line)
	end

	file:close()
end

-- Put each type of snippet in its own file
parse.consolodate = function()
	local types = {
		functions = function(line)
			return line:match("^%* `%w") and line:match("%)`")
		end,
		modifiers = function(line)
			return line:match("^#### `%[")
		end,
		elements = function(line)
			return line:match("^### `")
		end,
		tables = function(line)
			return line:match("^%* `minetest%.[%w_]+`")
		end,
	}

	for t, m in pairs(types) do
		local file = io.open(t .. ".txt", "w")
		for line in io.lines("trimmed.txt") do
			if m(line) then
				file:write("\n" .. line)
			end
		end
		file:close()		
	end
end

-- Convert each file to snippets
parse.snippets = function()
	local types = {
		functions = function(line, list, snippets, current)
			if table.exists(list, line) then
				local token = ":"
				if line:match("`%w+%.") or (line:match("`([%w_-]+)%(") and table.exists(globals, line:match("`([%w_-]+)%("))) then
					token = line:match("`(%w+)%.")
				end
				snippets[#snippets + 1] = {
					prefix = line:match("([%w_-]+)%("),
					body = line:match("%* `(%w*%.?.-)`"):gsub("^%w+%.", ""):gsub("(%(.*%))", function(args)
						local a = 0
						return args:gsub("[%w%s_-]+", function(arg)
							a = a + 1
							return ("${%s:%s}"):format(a, arg:gsub("^ ", ""))
						end):gsub(",", ", ")
					end),
					desc = (line:match("`:? (.*)") or ""):gsub("\"", "\\\""),
					kind = 2,
					detail = line:match("%* `(.-)`"),
					token = token,
				}
				current = true
			elseif current and not line:match("^%s*$") then
				if snippets[#snippets].desc ~= "" then
					line = "\n" .. line
				end
				snippets[#snippets].desc = snippets[#snippets].desc .. line
			else
				current = false
			end

			return current
		end,
		modifiers = function(line, list, snippets, current)
			if table.exists(list, line) then
				snippets[#snippets + 1] = {
					prefix = line:match("`%[(.-)[`:]"),
					body = line:match("#### `%[(.-)`"):gsub("(.*)", function(args)
						local a = 0
						return args:gsub("<(.-)>", function(arg)
							a = a + 1
							return ("${%s:%s}"):format(a, arg:gsub("^ ", ""))
						end)
					end),
					desc = "",
					kind = 13,
					detail = line:match("`%[(.-)[`:]"),
					token = "[",
				}
				current = 1
			elseif current and line:match("^%w") and not line:match("^Example:") then
				if snippets[#snippets].desc ~= "" then
					line = "\n" .. line
				end
				snippets[#snippets].desc = snippets[#snippets].desc .. line
				current = 2
			elseif current == 2 then
				current = false
			end

			return current
		end,
		elements = function(line, list, snippets, current)
			if table.exists(list, line) then
				snippets[#snippets + 1] = {
					prefix = line:match("`(.-)%["),
					body = line:match("### `(.-)`"):gsub("(.*)", function(args)
						local a = 0
						return args:gsub("<(.-)>", function(arg)
							a = a + 1
							return ("${%s:%s}"):format(a, arg:gsub("^ ", ""))
						end)
					end),
					desc = "",
					kind = 13,
					detail = line:match("`(.-)`"):gsub("[<>]", ""),
					token = "", -- Lack of token means elements wont be autocompleted
				}
				current = 1
			elseif current and line:match("^%*") then
				if snippets[#snippets].desc ~= "" then
					line = "\n" .. line
				end
				snippets[#snippets].desc = snippets[#snippets].desc .. line
				current = 2
			elseif current == 2 then
				current = false
			end

			return current
		end,
		tables = function(line, list, snippets, current)
			if table.exists(list, line) then
				snippets[#snippets + 1] = {
					prefix = line:match("`%w+%.(.-)`"),
					body = line:match("`%w+%.(.-)`"),
					desc = "",
					kind = 5,
					detail = line:match("`(.-)`"),
					token = "minetest",
				}
				current = true
			elseif current then
				snippets[#snippets].desc = snippets[#snippets].desc .. line
				current = false
			end

			return current
		end,
	}
	local snippets = {}

	for t, exec in pairs(types) do
		local list = {}
		for line in io.lines(t .. ".txt") do
			if line ~= "" then
				list[#list + 1] = line
			end
		end
		os.remove(t .. ".txt")

		local static = false
		for line in io.lines("trimmed.txt") do
			static = exec(line, list, snippets, static)
		end
	end
	os.remove("trimmed.txt")

	local file = io.open("../snippets.json", "w")
	file:write(json.encode(snippets))
	file:close()
end

-- Do the things
parse.trim()
parse.consolodate()
parse.snippets()
