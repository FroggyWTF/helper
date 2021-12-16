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

module.exports.agreeWithRules = (user) => {
  
};
