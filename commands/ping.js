import { SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("返回 Ping 值。");

export const action = async (ctx) => {
  const ping = Date.now() - ctx.createdTimestamp;

  await ctx.reply({ content: `${ping} ms`, ephemeral: true });
};
