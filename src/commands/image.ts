import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("image")
        .setDescription("Crée une nouvelle image avec un contexte et/ou une image de référence")
        .addStringOption(option => (
            option.setName("prompt")
                .setDescription("Renseigne le prompt de l'image a générer")
                .setRequired(true)
        ))
        .addAttachmentOption(option => (
            option.setName("reference")
                .setDescription("L'image de référence a utiliser pour générer l'image")
                .setRequired(false)
        ))
        .addStringOption(option => (
            option.setName("ratio")
                .setDescription("Définissez l'aspect ratio de l'image que vous souhaitez générer")
                .addChoices(
                    { name: "1:1", value: "1:1" },
                    { name: "16:9", value: "16:9" },
                    { name: "9:16", value: "9:16" }
                )
                .setRequired(true)
        ))
        .addStringOption(option => (
            option.setName("type")
                .setDescription("Choisissez le type de génération que vous souhaitez effectuer.")
                .addChoices(
                    { name: "Rapide", value: "fast" },
                    { name: "Haute Qualité", value: "high-quality"}
                )
                .setRequired(true)
        )),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const prompt = interaction.options.getString("prompt", true);
        const reference = interaction.options.getAttachment("reference", false);
        const ratio = interaction.options.getString("ratio", true);
        const type = interaction.options.getString("type", true);

        
    }
}