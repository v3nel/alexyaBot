import { EmbedBuilder } from 'discord.js';

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#57F287')
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createErrorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#ED4245')
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createWarningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#FEE75C')
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createLoadingEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#5865F2')
    .setDescription(`⏳ ${message}`)
    .setTimestamp();
}
