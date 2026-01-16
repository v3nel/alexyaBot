import { EmbedBuilder, User, GuildMember } from 'discord.js';

export function createUserEmbed(user: User, member?: GuildMember): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`👤 Profil de ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: '🆔 ID', value: user.id, inline: true },
      { name: '📅 Compte créé', value: user.createdAt.toLocaleDateString('fr-FR'), inline: true },
      { name: '🤖 Bot', value: user.bot ? 'Oui' : 'Non', inline: true }
    );

  if (member) {
    embed.addFields(
      { name: '📥 A rejoint le serveur', value: member.joinedAt?.toLocaleDateString('fr-FR') || 'Inconnu', inline: true },
      { name: '🎨 Couleur', value: member.displayHexColor, inline: true },
      { name: '👑 Rôles', value: member.roles.cache.size > 1 ? `${member.roles.cache.size - 1}` : 'Aucun', inline: true }
    );

    if (member.roles.cache.size > 1) {
      const roles = member.roles.cache
        .filter(role => role.id !== member.guild.id)
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, 10);
      
      embed.addFields({ name: '📋 Rôles principaux', value: roles.join(', ') || 'Aucun' });
    }
  }

  embed.setTimestamp();

  return embed;
}
