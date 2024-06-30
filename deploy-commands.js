import { REST, Routes } from "discord.js";
import config from "./config.js";
import fs from "fs";
import path from "path";

const { clientId, guildId, token } = config;

(async () => {
  const commands = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = path.join("commands");
  const commandsFolder = fs.readdirSync(foldersPath);

  for (const commandFile of commandsFolder) {
    const commandFilePath = path.join(foldersPath, commandFile);
    const command = await import("./" + commandFilePath);
    commands.push(command.command.toJSON());
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(token);

  // and deploy your commands!
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
