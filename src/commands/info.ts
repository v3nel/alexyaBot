import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../embeds/info.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Affiche des informations sur le bot'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = createInfoEmbed(interaction.client);
    await interaction.reply({ embeds: [embed] });
  },
};
