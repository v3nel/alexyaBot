# AlexYa Discord Bot

Bot Discord développé en TypeScript avec Discord.js v14, permettant d'interagir avec l'API Alexya.ai pour générer du texte et des images.

## 📋 Prérequis

- Bun v1.0 ou supérieur
- Un bot Discord créé sur le [Portail Développeur Discord](https://discord.com/developers/applications)
- Un compte Alexya.ai

## 🚀 Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
bun install
```

3. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

4. Remplissez les variables d'environnement dans `.env` :
   - `DISCORD_TOKEN` : Le token de votre bot
   - `CLIENT_ID` : L'ID de votre application Discord
   - `SUPABASE_URL` : L'URL de l'API Supabase (Alexya.ai)
   - `SUPABASE_API_KEY` : La clé API Supabase
   - `SUPABASE_PROJECT_ID` : L'ID du projet Supabase

## 📁 Structure du projet

```
alexyaBot/
├── src/
│   ├── commands/          # Commandes slash
│   │   ├── ping.ts       # Vérifier la latence du bot
│   │   ├── info.ts       # Informations sur le bot
│   │   ├── user.ts       # Informations sur un utilisateur
│   │   ├── login.ts      # Connexion à Alexya.ai
│   │   ├── image.ts      # Génération d'images avec Alexya.ai
│   │   └── askprompt.ts  # Test de prompt et pièces jointes
│   ├── events/            # Gestionnaires d'événements
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   └── guildCreate.ts
│   ├── embeds/            # Embeds réutilisables
│   │   ├── info.ts
│   │   ├── user.ts
│   │   ├── ask.ts
│   │   ├── image.ts
│   │   └── common.ts
│   ├── functions/         # Fonctions utilitaires
│   │   ├── ask.ts
│   │   ├── login.ts
│   │   ├── refresh.ts
│   │   ├── makeRequest.ts
│   │   ├── create-cookie.ts
│   │   ├── checkChannel.ts
│   │   ├── isCollectable.ts
│   │   └── image/        # Fonctions pour la génération d'images
│   ├── types/             # Déclarations TypeScript
│   ├── user/              # Données utilisateur (credentials)
│   ├── index.ts           # Point d'entrée principal
│   └── deploy-commands.ts # Script de déploiement des commandes
├── dist/                  # Fichiers compilés (généré)
├── .env                   # Variables d'environnement (à créer)
├── .env.example           # Exemple de configuration
├── tsconfig.json          # Configuration TypeScript
├── Dockerfile             # Configuration Docker avec Bun
└── package.json
```

## 💻 Utilisation

### Développement

Lancer le bot en mode développement (avec watch) :
```bash
bun run dev
```

### Production

1. Compilez le projet :
```bash
bun run build
```

2. Lancez le bot :
```bash
bun start
```

### Déployer les commandes slash

Avant la première utilisation, déployez les commandes slash :
```bash
bun run register
```

## 📝 Commandes disponibles

### Commandes de base
- `/ping` - Vérifie la latence du bot et de l'API Discord
- `/info` - Affiche les informations du bot (version, serveurs, utilisateurs)
- `/user [utilisateur]` - Affiche les informations d'un utilisateur Discord

### Commandes Alexya.ai
- `/login <email> <password>` - Connectez-vous à votre compte Alexya.ai pour utiliser les fonctionnalités IA
- `/image <type> <resolution>` - Génère une image avec Alexya.ai
  - **type** : `Rapide` ou `Haute Qualité`
  - **resolution** : Résolution de l'image (autocomplétion disponible)
  - Supporte les prompts interactifs et les images de référence
- `/askprompt` - Teste le système de prompt et de pièces jointes (développement)

## 🛠️ Ajouter de nouvelles commandes

1. Créez un nouveau fichier dans `src/commands/` (ex: `macommande.ts`)
2. Utilisez ce template :

```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('macommande')
    .setDescription('Description de ma commande'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Réponse de la commande');
  },
};
```

3. Déployez les commandes : `bun run register`

## 📦 Scripts disponibles

- `bun run dev` - Lance le bot en mode développement avec watch
- `bun run build` - Compile le projet avec Bun
- `bun start` - Lance le bot compilé
- `bun run register` - Déploie les commandes slash sur Discord

## 🐳 Docker

```bash
# Construire l'image
docker build -t alexyabot .

# Lancer le conteneur
docker run -d --env-file .env alexyabot
```

