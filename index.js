const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express'); // добавляем мини-сервер
const app = express();

// ----------------------
// HTTP сервер для Render
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(process.env.PORT || 3000, () => console.log('Server started'));

// ----------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ----------------------
// Вставьте сюда ID канала, куда бот будет писать поздравления
const CHANNEL_ID = "1488262489383899460";

// ----------------------
// Добавьте ID всех ролей и текст поздравления для каждого этапа
const stages = {
  "1487494028688756747": "🎉 Поздравляем с прохождением **ЭТАП 1**!🚀",
  "1487494098230186215": "🎉 Поздравляем с прохождением **ЭТАП 2**!🏆",
  "1488556952534520029": "🎉 Поздравляем с прохождением **ЭТАП 3**!💪",
  "1488557024626085978": "🎉 Поздравляем с прохождением **ЭТАП 4**!🔥",
  "1488557081203179772": "🎉 Поздравляем с прохождением **ЭТАП 5**!🌊",
  "1488557147452211322": "🎉 Поздравляем с прохождением **ЭТАП 6**!✨",
  "1488557207669706843": "🎉 Поздравляем с прохождением **ЭТАП 7**!🎖",
  "1488557255879168060": "🎉 Поздравляем с прохождением **ЭТАП 8**!🏅",
  "1488557327383662662": "🎉 Поздравляем с прохождением **ЭТАП 9**!🏁",
  "1488557384023543819": "🎉 Поздравляем с прохождением **ЭТАП 10**!👑"
};

// Множество, чтобы бот писал поздравление только один раз на каждого пользователя за каждый этап
const greetedUsers = new Set();

client.on('ready', () => {
  console.log(`Бот запущен как ${client.user.tag}`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  for (const [roleId, message] of Object.entries(stages)) {
    const hadRole = oldMember.roles.cache.has(roleId);
    const hasRole = newMember.roles.cache.has(roleId);

    if (!hadRole && hasRole) {
      const key = `${newMember.id}_${roleId}`;
      if (greetedUsers.has(key)) continue;

      const channel = newMember.guild.channels.cache.get(CHANNEL_ID);
      if (!channel) return;

      channel.send(`<@${newMember.id}> ${message}`);
      greetedUsers.add(key);
    }
  }
});

// ----------------------
// Токен берём из переменных окружения
client.login(process.env.TOKEN);
