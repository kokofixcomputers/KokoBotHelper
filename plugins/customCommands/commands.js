
module.exports = function(client) {
let customCommands63293 = [];

async function IvuQVSdioU() {
const { ButtonStyle } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
let builderVar_message;
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId == 'yesiwanttodoit') {
        builderVar_message = await (interaction.channel).send({
        content: String(('<@&1210078587923857500> Ping! Pinged by: ' + String(interaction.member))),
        embeds: [],
        components: [],
        files: []
      });

    }
  });

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == ("support_ping").replaceAll(" ", "-").toLowerCase()) {
        let yn = new ActionRowBuilder()
    const kVvtDZulKk_BUTTON = new ButtonBuilder()
    .setCustomId('yesiwanttodoit')
    .setLabel('yes')
    .setStyle(ButtonStyle.Success)
    .setDisabled(false)


    yn.addComponents(kVvtDZulKk_BUTTON);
  builderVar_message = await interaction.reply({
    content: 'Please do not spam this but if you really need to ping out support team please press yes',
    embeds: [],
    ephemeral: false,
    components: ([yn]),
    files: [],
    fetchReply: true
  });

    }
});
customCommands63293 = [...customCommands63293,
  {
    "name": ('support_ping').replaceAll(" ", "-").toLowerCase(),
    "type": 1,
    "description": 'Ping support team not every support will be pinged if they choose not to.',
    "options": [

    ]
  },]
}


IvuQVSdioU();


return customCommands63293
}
  