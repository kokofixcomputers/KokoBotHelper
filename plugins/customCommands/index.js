
module.exports = function(client) {
  const commands = require("./commands")(client)
  return commands
}