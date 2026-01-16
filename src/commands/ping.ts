import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Répond avec Pong!'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: 'Pong! 🏓', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    
    await interaction.editReply(`Pong! 🏓\nLatence: ${ping}ms\nAPI: ${Math.round(interaction.client.ws.ping)}ms`);
  },
};
