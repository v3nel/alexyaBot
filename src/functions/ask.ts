import { Attachment, ChatInputCommandInteraction, DMChannel, EmbedBuilder, Message, TextChannel } from "discord.js";
import { createErrorEmbed } from "../embeds/common";
import Files from "../types/Files";

export type askType = { message: string, attachments: Files[] }

export default async function ask(userId: string, channel: TextChannel | DMChannel, question: EmbedBuilder, interaction: ChatInputCommandInteraction): Promise<askType | undefined> {
    await interaction.editReply({embeds: [question]});
    let attachments: Attachment[] = [];

    const filter = (m: Message) => {
        return m.author.id === userId && !m.author.bot
    }

    const collector = await channel.awaitMessages({
        filter: filter,
        max: 1,
        time: 120_000
    });

    const message = collector.first();
    if (!message) {
        console.log(`Le bot a timeout sur la question ${question.data.description}`)
        const errorEmbed = createErrorEmbed("Temps Écoulé", "Le temps pour répondre a cette interaction")
        await interaction.editReply({embeds: [errorEmbed]})
        return
    }

    if (message.attachments.size !== 0) {
        attachments = [...message.attachments.values()]
    }
    
    const files = attachments.map(att => ({
        name: att.name,
        url: att.url,
        size: att.size,
        type: att.contentType
    })) as Files[];

    await message.delete();

    return {message: message.content, attachments: files}
}