import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Déclaration de type pour ajouter la propriété commands au Client
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
  }
}

dotenv.config();

// Créer le client Discord avec les intents nécessaires
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[INFO] Commande chargée: ${command.data.name}`);
    } else {
      console.warn(`[WARNING] La commande ${file} n'a pas les propriétés "data" et "execute"`);
    }
  }
}

// Charger les events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`[INFO] Event chargé: ${event.name}`);
  }
}

// Connexion au bot
client.login(process.env.DISCORD_TOKEN);
