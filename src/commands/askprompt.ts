import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import ask, { askType } from "../functions/ask";
import createAskEmbed from "../embeds/ask";
import isCollectable from "../functions/isCollectable";
import { createErrorEmbed, createSuccessEmbed } from "../embeds/common";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("askprompt")
        .setDescription("Test the prompt and attachments input"),

    async execute(interaction: ChatInputCommandInteraction) {

        await interaction.deferReply();

        if (!interaction.channel || !isCollectable(interaction.channel)){
            const errorEmbed = createErrorEmbed("Salon incompatible", "Le channel n'est pas un channel compatible avec cette commande. Veuillez utiliser un channel texte ou un dm.");
            return await interaction.editReply({embeds: [errorEmbed]})
        }

        const embed = createAskEmbed("Veuillez entrer ton prompt", "Envoie ton prompt ainsi que les photos de références pour la génération de ton image")
        const inputs = await ask(interaction.user.id, interaction.channel, embed, interaction)

        if (!inputs) {
            return
        }

        const successEmbed = createSuccessEmbed("Données récupérées", `Voici le prompt: ${inputs.message} et il y a ${inputs.attachments.length} images`)
        return await interaction.editReply({embeds: [successEmbed]})
    }
}