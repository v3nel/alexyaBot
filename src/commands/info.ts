import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../embeds/info';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Affiche des informations sur le bot'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = createInfoEmbed(interaction.client);
    await interaction.reply({ embeds: [embed] });
  },
};
