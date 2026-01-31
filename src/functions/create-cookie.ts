import fs from "fs/promises"

export default async function createCookie() {
    try {
        const user = await fs.readFile("./src/user/user.json", 'utf-8')
        const userb64 = Buffer.from(user, "utf-8").toString('base64url')

        const cookie = `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token=base64-${userb64}`
        return cookie
    } catch(err) {
        console.error("Erreur de génération, Le cookie n'a pas pu être généré", err)
        return 
    }
}