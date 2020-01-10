-- This is the script used to generate the snippets.json file.
-- Its generally useless

local json = require("json")
local snippets = {}

current = 0
for line in io.lines("lua_api.txt") do
	if line:match("%* `.-%(.-%)`") then
		snippets[#snippets + 1] = {
			prefix = line:match("`(.-)%("),
			body = line:match("`(.-)`"):gsub("(%(.*%))", function(args)
				local a = 0
				return args:gsub("[%w%s]+", function(arg)
					a = a + 1
					return ("${%s:%s}"):format(a, arg:gsub("^ ", ""))
				end):gsub(",", ", ")
			end),
			desc = (line:match("`:? (.*)") or ""):gsub("\"", "\\\""),
		}
		current = #snippets
	elseif not line:match("^%s$") and current > 0 then
		if snippets[#snippets].desc ~= "" then
			line = "\n" .. line
		end
		snippets[#snippets].desc = snippets[#snippets].desc .. line
	else
		current = 0
	end
end

local file = io.open("../snippets.json", "w")
file:write(json.encode(snippets))
file:close()
