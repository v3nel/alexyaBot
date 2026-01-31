import { TextChannel, ChatInputCommandInteraction, DMChannel } from "discord.js";
import createAskEmbed from "../../../embeds/ask";
import ask from "../../ask";

export default async function getPromptandAttachements(channel: TextChannel | DMChannel, userId: string, interaction: ChatInputCommandInteraction) {
    const askEmbed = createAskEmbed("Entrez votre promt", "Veuillez entrer envoyer votre prompt ainsi que les images de références pour l'image que vous souhatez générer (10 max)")
    const data = await ask(userId, channel, askEmbed, interaction)
    return data
}