import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const commands: any[] = [];
const commandsPath = path.join(__dirname, 'commands');

// Déployer les commandes
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    // Charger toutes les commandes
    if (fs.existsSync(commandsPath)) {
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const commandModule = await import(filePath);
        const command = commandModule.default || commandModule;
        
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        }
      }
    }

    console.log(`Déploiement de ${commands.length} commande(s) slash...`);

    const data: any = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log(`✅ ${data.length} commande(s) slash déployée(s) avec succès!`);
  } catch (error) {
    console.error('Erreur lors du déploiement des commandes:', error);
  }
})();
