import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { createErrorEmbed, createSuccessEmbed } from "../embeds/common";
import { z } from "zod";
import { AuthenticationError, APIError, login } from "../functions/login";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().max(128, "Le mot de passe doit avoir une longueur inférieure a 128")
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login to your Alexya.ai account")
        .addStringOption(option => (
            option.setName("email")
                .setDescription("Email lié a votre compte Alexya.ai")
                .setRequired(true)
        ))
        .addStringOption(option => (
            option.setName("password")
                .setDescription("Le mot de passe du compte Alexya.ai")
                .setRequired(true)
        )),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const email = interaction.options.getString("email", true)
        const password = interaction.options.getString("password", true);

        try {
            const valData = loginSchema.parse({email, password})
            
            const response = await login(valData.email, valData.password, interaction)

            console.log(`Le compte ${response} a été lié a AlexyaBot`)

            const successEmbed = createSuccessEmbed(
                "Connexion effectuée !!",
                `La connexion au compte ${response} a bien été effectué !! Vous pouvez maintenant utiliser AlexyaBot. \n Amusez vous bien !!!`
            );

            return await interaction.reply({embeds: [successEmbed]})
        } catch(err) {
            let errorEmbed: EmbedBuilder;

            if (err instanceof z.ZodError) {
                errorEmbed = createErrorEmbed(
                    "Validation échouée",
                    "La validation du format des données a échoué. Veuillez renseigner un email ainsi que mot de passe valide."
                )
            } else {
                errorEmbed = createErrorEmbed(
                    "Erreur Inconnue",
                    `Une erreur inconnue a eu lieu veuillez voir la console ou ci-après: ${err}`
                )
            };

            return await interaction.reply({embeds: [errorEmbed]})
        }
    }
}