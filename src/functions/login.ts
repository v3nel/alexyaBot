import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { createErrorEmbed } from "../embeds/common";
import fs from "fs/promises";

export class APIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "APIError";
    }
}
export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "APIError";
    }
}

export async function login(email:string, password:string, interaction: ChatInputCommandInteraction) {
    try {    
        const request = await fetch(
            process.env.SUPABASE_URL+"auth/v1/token?grant_type=password",
            {
                method: 'POST',
                headers: {
                    'Origin': "alexya.ai",
                    'Accept': "*/*",
                    'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`,
                    'Apikey': process.env.SUPABASE_API_KEY as string,
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    gotrue_meta_security: {}
                })
            }
        );

        const response = await request.json();

        if (request.status === 200) {
            await fs.writeFile(
                "./user/credentials.json",
                JSON.stringify({ email, password }, null, 2)
            );
            await fs.writeFile(
                "./user/user.json",
                JSON.stringify(response, null, 2)
            );
            return response.user.email
        } else if (request.status === 403) {
            throw new AuthenticationError("La combinaison email/password n'est pas valide")
        } else if (request.status === 401) {
            throw new APIError("L'API key n'est pas valide")
        } else {
            throw new Error(JSON.stringify(response))
        };
    } catch(err) {
        let errorEmbed: EmbedBuilder;

        if (err instanceof APIError) {
            errorEmbed = createErrorEmbed(
                "Erreur d'API",
                "La clé d'API n'est pas valide\n Si le problème persiste, contactez @<580447236702470176>"
            )
        } else if (err instanceof AuthenticationError) {
            errorEmbed = createErrorEmbed(
                "Erreur de connexion",
                "la combinaison email/mot de passe n'est pas valide. Veuillez réessayer avec une autre combinaison\n Si le problème persiste, contactez @<580447236702470176>"
            )
        } else {
            errorEmbed = createErrorEmbed(
                "Erreur Inconnue",
                `Une erreur inconnue a eu lieu veuillez voir la console ou ci-après: ${err}\n Si le problème persiste, contactez @<580447236702470176>`
            )
        };

        return await interaction.reply({embeds: [errorEmbed]})
    }
}