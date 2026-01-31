import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import createCookie from "../functions/create-cookie";
import { createErrorEmbed, createLoadingEmbed } from "../embeds/common";
import fetch, { Blob, FormData } from "node-fetch";
import { IntegerSchema } from "zod/v4/core/json-schema.cjs";
import { generatedImageEmbed } from "../embeds/image";
import getPromptandAttachements from "../functions/image/inputs/getPromptandAttachment";
import checkChannel from "../functions/checkChannel";
import { processAttachment } from "../functions/image/scripts/processAttachment";

class FormatError extends Error {
    constructor(message: string) {
        super(message)
        this.name="FormatError"
    }
}

type UploadResponse = { 
    success: boolean, 
    imageUrl?: string, 
    generationId?: string
}

type CreateGenerationResponse = {
    id: string,
    user_id: string,
    type: string,
    title: string,
    status: string,
    input_image_url?: string,
    output_url?: string,
    thumbnail_url?:string,
    settings: {
        mode: string,
        width: number,
        height: number,
        images: string[],
        prompt: string
    }
    credit_used: number,
    created_at: string,
    completed_at?: string,
    retry_count: number,
    processing_by?:string,
    trend_id?:string,
    prompt: string
}

type PollResponse = {
    success: boolean,
    status: string,
    outputUrl?: string,
    thumbnailUrl?: string,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("image")
        .setDescription("Crée une nouvelle image avec un contexte et/ou une image de référence")
        .addStringOption(option => (
            option.setName("type")
                .setDescription("Choisissez votre type de génération d'image")
                .addChoices([
                    {name: "Rapide", value: "classic"},
                    {name: "Haute Qualité", value: "high-quality"}
                ])
                .setRequired(true)
        ))
        .addStringOption( option => (
            option.setName("resolution")
                .setDescription("Entrez/choisissez la résolution de l'image a générer")
                .setAutocomplete(true)
                .setRequired(true)
        )),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const type = interaction.options.getString("type", true);
        const resolution = interaction.options.getString("resolution");
        await interaction.deferReply();

        const channel = interaction.channel;

        if (!channel || !checkChannel(channel)) return;

        const PromptandAttachments = await getPromptandAttachements(channel, interaction.user.id, interaction);

        if (!PromptandAttachments) return;

        let attachmentsLinks = [];
        if (PromptandAttachments.attachments) {
            PromptandAttachments.attachments.forEach(element => {
                const link = processAttachment(element.url);
                attachmentsLinks.push(link)
            });
        }

        
    
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);

        const resolutionChoices = [
            { name: "1:1", value: "4096x4096" },
            { name: "16:9", value: "1920:1080" },
            { name: "9:16", value: "1080x1920" },
            { name: "4:3", value: "4096x3072" },
        ];

        if (focusedOption.name === "resolution") {
            const filtered = resolutionChoices
                .filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
                    || choice.value.toLowerCase().includes(focusedOption.value.toLowerCase()))
                .slice(0, 25);
            await interaction.respond(filtered);
        }
    }
}