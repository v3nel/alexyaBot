import { EmbedBuilder, Client } from 'discord.js';

export function createInfoEmbed(client: Client): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📊 Informations du Bot')
    .setDescription('Bot Discord développé avec Discord.js et TypeScript')
    .addFields(
      { name: '🤖 Nom', value: client.user?.tag || 'N/A', inline: true },
      { name: '🆔 ID', value: client.user?.id || 'N/A', inline: true },
      { name: '📅 Créé le', value: client.user?.createdAt.toLocaleDateString('fr-FR') || 'N/A', inline: true },
      { name: '🌐 Serveurs', value: `${client.guilds.cache.size}`, inline: true },
      { name: '👥 Utilisateurs', value: `${client.users.cache.size}`, inline: true },
      { name: '⏱️ Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }
    )
    .setThumbnail(client.user?.displayAvatarURL() || null)
    .setTimestamp()
    .setFooter({ text: `Demandé par ${client.user?.tag}` });

  return embed;
}
