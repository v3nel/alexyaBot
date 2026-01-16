# AlexYa Discord Bot

Bot Discord développé en TypeScript avec Discord.js v14.

## 📋 Prérequis

- Node.js v18 ou supérieur
- Un bot Discord créé sur le [Portail Développeur Discord](https://discord.com/developers/applications)

## 🚀 Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

4. Remplissez les variables d'environnement dans `.env` :
   - `DISCORD_TOKEN` : Le token de votre bot
   - `CLIENT_ID` : L'ID de votre application Discord

## 📁 Structure du projet

```
alexyaBot/
├── src/
│   ├── commands/          # Commandes slash
│   │   ├── ping.ts
│   │   ├── info.ts
│   │   └── user.ts
│   ├── events/            # Gestionnaires d'événements
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   └── guildCreate.ts
│   ├── embeds/            # Embeds réutilisables
│   │   ├── info.ts
│   │   ├── user.ts
│   │   └── common.ts
│   ├── types/             # Déclarations TypeScript
│   │   └── discord.d.ts
│   ├── index.ts           # Point d'entrée principal
│   └── deploy-commands.ts # Script de déploiement des commandes
├── dist/                  # Fichiers compilés (généré)
├── .env                   # Variables d'environnement (à créer)
├── .env.example           # Exemple de configuration
├── tsconfig.json          # Configuration TypeScript
└── package.json
```

## 💻 Utilisation

### Développement

Lancer le bot en mode développement (avec ts-node) :
```bash
npm run dev
```

### Production

1. Compilez le projet :
```bash
npm run build
```

2. Lancez le bot :
```bash
npm start
```

### Déployer les commandes slash

Avant la première utilisation, déployez les commandes slash :
```bash
npm run register
```

## 📝 Commandes disponibles

- `/ping` - Vérifie la latence du bot
- `/info` - Affiche les informations du bot
- `/user [utilisateur]` - Affiche les informations d'un utilisateur

## 🛠️ Ajouter de nouvelles commandes

1. Créez un nouveau fichier dans `src/commands/` (ex: `macommande.ts`)
2. Utilisez ce template :

```typescript
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('macommande')
    .setDescription('Description de ma commande'),
  
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Réponse de la commande');
  },
};
```

3. Déployez les commandes : `npm run register`

## 📦 Scripts npm

- `npm run dev` - Lance le bot en mode développement
- `npm run build` - Compile le TypeScript en JavaScript
- `npm start` - Lance le bot compilé
- `npm run register` - Déploie les commandes slash

## 📄 Licence

ISC

## 👤 Auteur

venel
