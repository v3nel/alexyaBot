import fs from "fs/promises"
import { createErrorEmbed } from "../embeds/common"
import { ChatInputCommandInteraction } from "discord.js"

export default async function createCookie(interaction: ChatInputCommandInteraction) {
    try {
        const user = await fs.readFile("./src/user/user.json", 'utf-8')
        const userb64 = Buffer.from(user, "utf-8").toString('base64url')

        const cookie = `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token=base64-${userb64}`
        return cookie
    } catch(err) {
        const errorEmbed = createErrorEmbed(
            "Erreur de génération",
            "Le cookie n'a pas pu être généré. Veuillez réessayer plus tard.\n Si le problème persiste, contactez @<580447236702470176>"
        )
        return await interaction.reply({embeds: [errorEmbed]})
    }
}