import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import config from "./config.js";
import fsc from "fs";
import path from "path";

async function main() {
  // client
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  // commands
  const commandsPath = path.join("commands");
  const commandsFolder = fsc.readdirSync(commandsPath);

  client.commands = new Collection();

  for (const commandsName of commandsFolder) {
    const commandFilePath = path.join(commandsPath, commandsName, "index.js");
    const command = await import("./" + commandFilePath);

    client.commands.set(command.command.name, {
      data: command.command,
      execute: command.action,
    });
  }

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });

  client.login(config.token);
}

main();
