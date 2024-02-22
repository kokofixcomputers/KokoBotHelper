
const { Client, GatewayIntentBits, Partials } = require('discord.js');
  const client = new Client({ partials: [Partials.Message, Partials.Channel, Partials.Reaction], intents: Object.keys(GatewayIntentBits).map((a) => { return GatewayIntentBits[a] }) });
  client.setMaxListeners(0);
const { REST, Routes } = require('discord.js');
const http = require('http'); // Import the 'http' module
const url = require('url'); // Import the 'url' module
const fs = require('fs');



var commands = []

const filenames = fs.readdirSync('./plugins', { withFileTypes: true });
  
// Put ignore_ in front of the directory name to ignore the plugin
console.log('[1/3] Loading plugins')
console.log('_________________________________________________________________________\n')
filenames.forEach(async (file) => {
  if (!(file.name).startsWith('ignore_')) {
    if (file.isDirectory()) {
      try {
        const cmdTmp = require('./plugins/' + file.name)(client)
        cmdTmp.forEach((cmDD) => {
          commands.push(cmDD)
        })
        console.log('✅ Success: \'' + file.name + '\'')
      }
      catch (e) {
        console.error(e);
        throw '❌ Error while loading file "' + file.name + '", Error: ' + e
      }
    }
  }
});
console.log('_________________________________________________________________________\n')
console.log("> Step 1 success")

// Create an HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Handle different routes
  if (path === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is a simple HTTP server!');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Listen on port 8080
server.listen(8080, () => {
  console.log('HTTP server is running on port 8080');
});
  


const TOKEN = process.env.BOTTOKEN;
const rest = new REST({ version: '10' }).setToken(TOKEN);
const CLIENT_ID = "1191187634870026290";

(async () => {
  try {
    var success = true;
    console.log("[2/3] Loading slash commands");

    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    } catch (e) {
      success = false;
    }

    if (success) console.log("> Step 2 success");
  } catch (error) {
    console.error(error);
  }
})();


console.log('[3/3] Logging in')
client.on('ready', () => {
  console.log('> Step 3 success')
  console.log(`Your bot "${client.user.tag}" is now online!`);
  console.log('If you are running the bot locally, press Ctrl + C to stop it.')

  

  client.user.setPresence({ status: "online"});
});

client.login(TOKEN).catch((e) => {
  console.clear();
  console.log("❌ Error while starting the bot.");
  if (String(e).includes("Used disallowed intents")) {
    console.log("> Seems that you did not enable the Privileged Gateway intents");
    console.log(`> You can enable them at: https://discord.com/developers/applications/${CLIENT_ID}/bot`);
  } else {
    console.log("> Make sure that your token is correct.");
  }
  console.log("Feel free to join our discord server to ask for help");
});

