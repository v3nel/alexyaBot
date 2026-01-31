import { EmbedBuilder } from "discord.js";

export default function createAskEmbed(title: string, description: string) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor("#2d5cf3")
        .setTimestamp()
}