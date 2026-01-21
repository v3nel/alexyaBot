import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import createCookie from "../functions/create-cookie";
import { createErrorEmbed, createLoadingEmbed } from "../embeds/common";
import fetch, { Blob, FormData } from "node-fetch";
import { IntegerSchema } from "zod/v4/core/json-schema.cjs";
import { generatedImageEmbed } from "../embeds/image";

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
            option.setName("prompt")
                .setDescription("Renseigne le prompt de l'image a générer")
                .setRequired(true)
        ))
/*        .addStringOption(option => (
            option.setName("ratio")
                .setDescription("Définissez l'aspect ratio de l'image que vous souhaitez générer")
                .addChoices(
                    { name: "1:1", value: "1:1" },
                    { name: "16:9", value: "16:9" },
                    { name: "9:16", value: "9:16" }
                )
                .setRequired(true)
        )) */
        .addIntegerOption(option => (
            option.setName("hauteur")
                .setDescription("La hauteur en px de l'image que vous souhaitez générer (max 4096)")
                .setMaxValue(4096)
                .setRequired(true)
        ))
        .addIntegerOption(option => (
            option.setName("largeur")
                .setDescription("La largeur en px de l'image que vous souhaitez générer (max 4096)")
                .setMaxValue(4096)
                .setRequired(true)
        ))
        .addStringOption(option => (
            option.setName("type")
                .setDescription("Choisissez le type de génération que vous souhaitez effectuer.")
                .addChoices(
                    { name: "Rapide", value: "classic" },
                    { name: "Haute Qualité", value: "high-quality"}
                )
                .setRequired(true)
        ))
        .addAttachmentOption(option => (
            option.setName("reference")
                .setDescription("L'image de référence a utiliser pour générer l'image")
                .setRequired(false)
        )),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const prompt = interaction.options.getString("prompt", true);
        const reference = interaction.options.getAttachment("reference", false);
        // const ratio = interaction.options.getString("ratio", true);
        const height = interaction.options.getInteger("hauteur", true)
        const width = interaction.options.getInteger("largeur", true)
        const typeImage = interaction.options.getString("type", true);
        let referenceUrl = "";

        try {
            await interaction.deferReply();

            const cookie = await createCookie(interaction);
            const validFormat = ['image/jpeg', 'image/png', 'image/webp']
            if (reference && validFormat.includes(reference.contentType || "")) {
                const downloadImage = await fetch(reference.url);
                const imageBuffer = Buffer.from(await downloadImage.arrayBuffer());
                
                const formData = new FormData();
                formData.append("file", new Blob([imageBuffer]), reference.name)
                const uploadImage = await fetch(process.env.ALEXYA_API_URL + "/seedream-edit/upload",
                    {
                        method: "POST",
                        headers: {
                            'cookie': cookie as string
                        },
                        body: formData,
                        
                    }
                )
                    .then((r) => {
                        if (!r.ok) {
                            throw new Error("Il y a eu une erreur avec l'upload de l'image de reference")
                        } else {
                            return r.json() as Promise<UploadResponse>;
                        }
                    }) 
                
                if (!uploadImage.success) {
                    throw new Error("Il y a eu une erreur inconnue lors de l'upload de l'image")
                } else {
                    referenceUrl = uploadImage.imageUrl || ""
                }

            } else if (reference && reference.contentType) {
                throw new FormatError(reference.contentType)
            }

            const sendingEmbed = createLoadingEmbed(
                "Génération en cours",
                "Votre requete est envoyée au serveur d'Alexya.ai, veuillez patienter..."
            )
            await interaction.reply({embeds: [sendingEmbed]})

            const generationBody = {
                title: "Edit",
                prompt: prompt,
                input_image_url: "",
                settings: {
                    prompt: prompt,
                    width: width,
                    height: height,
                    images: [
                        referenceUrl
                    ],
                    mode: typeImage
                }
            }

            if (referenceUrl !== "") {
                generationBody.input_image_url = referenceUrl;
            } else {
                generationBody.settings.images = []
            }

            const createGeneration = await fetch(process.env.ALEXYA_API_URL + "/generate-picture",
                {
                    method: "POST",
                    headers: {
                        'cookie': cookie as string
                    },
                    body: JSON.stringify(generationBody)
                }
            )
                .then((r) => {
                    if (!r.ok) {
                        throw new Error("Il y a eu une erreur lors de la demande de génération d'image veuillez vérifier que vous êtes en possession d'assez de crédits pour effectuer la demande")
                    } else {
                        return r.json() as Promise<CreateGenerationResponse>
                    }
                })
            
            const generatingEmbed = createLoadingEmbed(
                "Génération en cours",
                "L'image que vous avez demandé est en cours de génération. Veuillez patienter..."
            )
            await interaction.editReply({embeds: [generatingEmbed]})

            const id = createGeneration.id

            const Poll = await fetch(process.env.ALEXYA_API_URL + "/poll-image-generation",
                {
                    method: "POST",
                    headers: {
                        'Cookie': cookie as string
                    },
                    body: JSON.stringify({
                        id: id as string
                    })
                }
            ).then((r) => {
                if (!r.ok) {
                    throw new Error("Il y a eu une erreur lors de la récupération de l'image")
                }
                return r.json() as Promise<PollResponse>
            })
            
            if (Poll.success) {
                const successEmbed = generatedImageEmbed(Poll.outputUrl || "", interaction)
                return interaction.editReply({embeds: [successEmbed]})
            } else {
                throw new Error("Il y a eu une erreur lors de la génération de votre image veuillez acceder au site web Alexya.ai ou recommencer")
            }

        } catch(err) {
            let errorEmbed;
            if (err instanceof FormatError) {
                errorEmbed = createErrorEmbed(
                    "Erreur de format",
                    `Le format de l'image de reference que vous avez fourni n'est pas valide.\nValeur attendues : .png, .jpeg, .jpg, .webp\nValeur obtenue: ${err.message}`
                )
            } else (
                errorEmbed = createErrorEmbed(
                    "Erreur Inconnue",
                    `Une erreur inconnue a eu lieu veuillez voir la console ou ci-après: ${err}\n Si le problème persiste, contactez @<580447236702470176>`
                )
            )
            if (interaction.replied) {
                return await interaction.editReply({embeds: [errorEmbed]})
            } 
            
            return await interaction.reply({embeds: [errorEmbed]})
        }

    }
}