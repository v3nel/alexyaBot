import { ChatInputCommandInteraction } from "discord.js";
import fs from "fs/promises";
import { createErrorEmbed } from "../embeds/common";
import fetch from "node-fetch";

export async function refresh(interaction: ChatInputCommandInteraction) {
    try {
        const data = await fs.readFile('./user/user.json', 'utf8');
        const user = JSON.parse(data);

        const request = await fetch(
            process.env.SUPABASE_URL + "auth/v1/token?grant_type=refresh_token",
            {
                method: "POST",
                headers: {
                    'Origin': "alexya.ai",
                    'Accept': "*/*",
                    'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`,
                    'Apikey': process.env.SUPABASE_API_KEY as string,
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',
                },
                body: JSON.stringify({
                    refresh_token: user.refresh_token
                })
            }
        );

        const response = await request.json() as Record<string, unknown>;

        if (request.status === 200) {
            const user = JSON.parse(data);
            const updated = { ...user, ...response };
            await fs.writeFile(
                "./user/user.json", 
                JSON.stringify(updated, null, 2)
            );
            return true
        } else {    
            throw new Error(`${JSON.stringify(response)} \n Essayez de vous reconnecter en utilisant la commande /login`)
        }
    } catch (err) {
        console.error('Error reading user.json:', err);
        const errorEmbed = createErrorEmbed(
            "Erreur de rafraishissement du token",
            `Il y a eu une erreur lors du raffraishissement du token : ${err}\n Si le problème persiste, contactez @<580447236702470176>`
        )
        return await interaction.reply({embeds: [errorEmbed]})
    }
}