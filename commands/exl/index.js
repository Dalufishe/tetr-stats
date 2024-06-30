import { SlashCommandBuilder } from "discord.js";

export const cooldown = 5000; // ms

export const command = new SlashCommandBuilder()
  .setName("exl")
  .setDescription("取的 TETR.IO 玩家資料")
  .addStringOption((option) =>
    option.setName("player").setDescription("玩家名稱")
  );

export const action = async (ctx) => {
  const playerName =
    ctx.options.getString("player") ?? "No player's name provided";

  if (playerName) {
    const res = await fetch(
      `https://ch.tetr.io/api/users/${playerName.toLowerCase()}`
    );
    const data = await res.json();
    const userData = data?.data?.user;
    const apm = userData?.league.apm;
    const vs = userData?.league.vs;
    const pps = userData?.league.pps;
    const app = (apm / pps / 60).toFixed(3);
    const ds = (vs / apm).toFixed(2);

    await ctx.reply({
      content: `${playerName} - ${app} app ${ds} DS`,
    });
  }
};
