import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { processAttachment } from '../functions/image/processAttachment.js';
import downloadAttachment from '../functions/image/downloadAttachment.js';
import uploadAttachment from '../functions/image/uploadAttachment.js';

export default {
  data: new SlashCommandBuilder()
    .setName('testupload')
    .setDescription('Teste l\'upload d\'une image vers Alexya.ai')
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('L\'image à uploader')
        .setRequired(true)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      const attachment = interaction.options.getAttachment('image', true);
      
      // Vérifier que c'est bien une image
      if (!attachment.contentType || !attachment.contentType.startsWith('image/')) {
        await interaction.editReply('❌ Le fichier fourni n\'est pas une image valide.');
        return;
      }

      console.log('\n=== TEST UPLOAD ===');
      console.log('📎 Attachment URL:', attachment.url);
      console.log('📝 Content Type:', attachment.contentType);
      console.log('📏 Size:', attachment.size, 'bytes');
      console.log('📛 Name:', attachment.name);

      await interaction.editReply('⏳ Téléchargement de l\'image...');

      // Télécharger l'image
      const buffer = await downloadAttachment(attachment.url);
      console.log('✅ Image téléchargée, taille du buffer:', buffer.length);

      await interaction.editReply('⏳ Upload vers Alexya.ai...');

      // Upload vers Alexya.ai
      const uploadedUrl = await uploadAttachment(buffer, attachment.contentType);

      if (uploadedUrl) {
        console.log('✅ Upload réussi! URL:', uploadedUrl);
        await interaction.editReply({
          content: `✅ **Upload réussi!**\n\n` +
                   `📎 Fichier original: ${attachment.name}\n` +
                   `📝 Type: ${attachment.contentType}\n` +
                   `📏 Taille: ${attachment.size} bytes\n` +
                   `🔗 URL uploadée: ${uploadedUrl}`
        });
      } else {
        console.log('❌ Upload échoué - pas d\'URL retournée');
        await interaction.editReply('❌ **Échec de l\'upload** - Aucune URL retournée par le serveur.');
      }

    } catch (error) {
      console.error('❌ Erreur lors du test d\'upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      await interaction.editReply(`❌ **Erreur lors de l'upload:**\n\`\`\`${errorMessage.substring(0, 500)}\`\`\``);
    }
  },
};
