import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

export function generatedImageEmbed(imageUrl: string, interaction: ChatInputCommandInteraction) {
    return new EmbedBuilder()
        .setTitle("Génération réussie")
        .setColor("#57F287")
        .setDescription(`La génération de votre imaga a réussi. Vous pouvez la visualiser ci dessous ou la télécharger en cliquant sur [ce lien](${imageUrl})`)
        .setThumbnail(imageUrl)
        .setFooter({text: `Image générée par : ${interaction.user.username}`})
}