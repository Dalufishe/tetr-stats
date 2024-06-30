import { SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";
import cheerio from "cheerio";
import path from "path";
import nodeHtmlToImage from "node-html-to-image";

export const cooldown = 5000; // ms

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
    const res = await fetch(
      `https://ch.tetr.io/api/users/${playerName.toLowerCase()}`
    );
    const data = await res.json();
    const userData = data?.data?.user;

    const playerId = userData?._id;
    const rank = userData?.league?.rank;
    const rating = userData?.league?.rating;
    const pps = userData?.league?.pps;
    const apm = userData?.league?.apm;
    const vs = userData?.league?.vs;

    // generate image
    const template = await fs.readFile(
      path.join(__dirname(import.meta), "template", "stat.html"),
      {
        encoding: "utf-8",
      }
    );
    const $ = cheerio.load(template);

    $(".avatar").replaceWith(
      `<img class="avatar" src=https://tetr.io/user-content/avatars/${playerId}.jpg?rev=></img>`
    );
    $(".player-rank-img").replaceWith(
      `<img class="player-rank-img" src=https://tetr.io/res/league-ranks/${rank}.png></img>`
    );
    $(".player-name").replaceWith(
      `<div class="player-name">${playerName.toUpperCase()}</div>`
    );
    $(".player-rank").replaceWith(
      `<p class="player-rank">${rating.toFixed(0).toString().toUpperCase()}</p>`
    );
    $(".player-apm").replaceWith(`<p class="player-apm">${apm}</p>`);
    $(".player-pps").replaceWith(`<p class="player-pps">${pps}</p>`);
    $(".player-vs").replaceWith(`<p class="player-vs">${vs}</p>`);

    await ctx.deferReply({ ephemeral: true });

    const imagePath = path.join(
      __dirname(import.meta),
      "output",
      `${playerId}.png`
    );

    const imageBuffer = await nodeHtmlToImage({
      html: $.html(),
    });

    await fs.writeFile(imagePath, imageBuffer);

    await ctx.editReply({
      files: [imageBuffer],
    });
  }
};
