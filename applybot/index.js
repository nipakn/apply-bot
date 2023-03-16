const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const token = ' ' // bot token

const RoleAddToAcceptedUsers = '123'; // role id
const ApplyCommand = '!teehakemus';
const ApplyChannel = '123'; // channel id
const ApplySendToChannel = '123'; // channel id
const MessageToAuthor = 'Hakemuksesi on vastaanotettu! Nyt voit vain odotella vastausta ylläpidolta.';
const ErrorMessage = 'Sinulle tuli virhe hakemusta lähettäessä, odota hetki ja yritä uudelleen!';
const AcceptCommand = '!hyvaksyhakemus';
const ArchiveChannel = '123'; // channel id
const NoApplication = 'Kyseisellä koodilla ei ole hakemuksia odotustilassa!'

client.on("messageCreate", async message => {
  if (message.content.startsWith(ApplyCommand)) {
    if (message.channel.id === ApplyChannel) {
      try {
        message.delete();
        const code = Math.floor(Math.random() * 1000000);
        const application = `Käyttäjän: ${message.author.tag} WL-hakemus (koodilla ${code}):\n\n${message.content.replace(ApplyCommand, '')}`;
        const channel = client.channels.cache.get(ApplySendToChannel);
        channel.send(application);
        message.author.send(MessageToAuthor);
      } catch (error) {
        console.error(error);
        await message.author.send(ErrorMessage);
      }
    }
  } else if (message.content.startsWith(AcceptCommand)) {
    const code = message.content.split(" ")[1];
    const archiveChannel = client.channels.cache.get(ArchiveChannel);
    const applySendToChannel = client.channels.cache.get(ApplySendToChannel);
    const messages = await applySendToChannel.messages.fetch();
    const application = messages.find(m => m.content.includes(`koodilla ${code}`));
    if (!application) {
      await message.channel.send(NoApplication);
      return;
    }
    const user = application.author;
    const member = await message.guild.members.fetch(user);
    await member.roles.add(RoleAddToAcceptedUsers);
    await message.delete();
    await application.delete();
    const archivedMessage = await archiveChannel.send(`**HAKEMUSARKISTO**\n\n${application.content.replace(ApplyCommand, '')}`);
    await archivedMessage.react('✅');
  }  
});

client.login(token)