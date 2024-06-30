import { SlashCommandBuilder } from "discord.js";

export const cooldown = 5000 // ms

export const command = new SlashCommandBuilder()
  .setName("io")
  .setDescription("取的 TETR.IO 玩家資料")
  .addStringOption((option) =>
    option.setName("player").setDescription("玩家名稱")
  );

export const action = async (ctx) => {
  const playerName =
    ctx.options.getString("player") ?? "No player's name provided";

  if (playerName) {
    
    const res = await fetch(`https://ch.tetr.io/api/users/${playerName.toLowerCase()}`);
    const data = await res.json();
    const userData = data?.data?.user;

    await ctx.reply({
      content: `${playerName} - ${userData?.league?.pps} pps - ${userData?.league?.apm} apm - ${userData?.league?.vs} vs`,
    });
  }
};
