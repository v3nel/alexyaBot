import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import { createUserEmbed } from '../embeds/user';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Affiche des informations sur un utilisateur')
    .addUserOption(option =>
      option
        .setName('utilisateur')
        .setDescription('L\'utilisateur à afficher')
        .setRequired(false)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);
    
    const embed = createUserEmbed(user, member as GuildMember);
    await interaction.reply({ embeds: [embed] });
  },
};
