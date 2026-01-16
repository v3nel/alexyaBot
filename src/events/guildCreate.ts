import { Events, Guild } from 'discord.js';

module.exports = {
  name: Events.GuildCreate,
  execute(guild: Guild) {
    console.log(`✅ Bot ajouté au serveur: ${guild.name} (ID: ${guild.id})`);
    console.log(`   Membres: ${guild.memberCount}`);
  },
};
