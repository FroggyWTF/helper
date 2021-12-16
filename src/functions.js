const nacl = require('tweetnacl');
const fetch = require('node-fetch');

module.exports.verifyRequest = (req) => {
  try {
    const PUBLIC_KEY = process.env.publicKey;
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = JSON.stringify(req.body);

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex'),
    );

    return isVerified;
  } catch {
    return false;
  }
};

module.exports.respond = (interaction, res, data) => {
  fetch(`https://discord.com/api/interactions/${interaction.id}/${interaction.token}/callback`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(data).length,
      Authorization: `Bot ${process.env.botToken}`,
      'User-Agent': 'DiscordBot/frogge',
    },
  }).then(() => res.status(200).send('Ok!')).catch(console.error);
};

const roleConfig = require('./config.json');

module.exports.agreeWithRules = (interaction, res, user) => {
  fetch(`https://discord.com/api/v9/guilds/${roleConfig.guildId}/members/${user}/roles/${roleConfig.roleId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${process.env.botToken}`,
      'User-Agent': 'DiscordBot/frogge',
    },
  }).then((err, meta) => {
    if (meta.status !== 204) {
      console.error(err, meta);
      return this.respond(interaction, res, { type: 4, data: { content: 'Something went wrong. Try again later or DM a staff member!', flags: 64 } });
    }
    return this.respond(interaction, res, { type: 4, data: { content: ':tada: Welcome to the server!', flags: 64 } });
  });
};
